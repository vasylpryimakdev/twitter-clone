import { Injectable } from "@nestjs/common";
import { CommentsRepository } from "../../comments/comments.repository";
import { Comment } from "../../comments/comment.entity";
import { POST_SCORE_WEIGHTS } from "../../posts/posts.constants";
import { PostImpact } from "../types/post";

@Injectable()
export class CommentDeletionPlanner {
  constructor(private readonly commentsRepo: CommentsRepository) {}

  async buildByUser(userId: string, excludePostIds: string[] = []) {
    const comments = await this.commentsRepo.findByAuthor(userId);
    const filtered = excludePostIds.length
      ? comments.filter((comment) => !excludePostIds.includes(comment.postId))
      : comments;

    return this.collectTree(filtered);
  }

  async buildByPost(postId: string) {
    const comments = await this.commentsRepo.findByPost(postId);
    return this.collectTree(comments);
  }

  async buildByComment(commentId: string) {
    const comment = await this.commentsRepo.findById(commentId);
    return comment ? this.collectTree([comment]) : this.emptyPlan();
  }

  private async collectTree(rootComments: Comment[]) {
    const cascadeCommentIds: string[] = [];

    const postImpact = new Map<string, PostImpact>();
    const parentImpact = new Map<string, { repliesDelta: number }>();

    const visited = new Set<string>();

    const queue: Comment[] = [...rootComments];

    const processComment = (comment: Comment) => {
      if (visited.has(comment.id)) return;

      visited.add(comment.id);

      cascadeCommentIds.push(comment.id);

      this.applyCommentImpact(comment, postImpact, parentImpact);
    };

    for (const root of rootComments) {
      processComment(root);
    }

    while (queue.length) {
      const batch = queue.splice(0, 20);

      const replySets = await Promise.all(
        batch.map((comment) => this.findAllReplies(comment.id)),
      );

      for (const replies of replySets) {
        for (const reply of replies) {
          if (visited.has(reply.id)) continue;

          visited.add(reply.id);

          queue.push(reply);

          cascadeCommentIds.push(reply.id);

          this.applyCommentImpact(reply, postImpact, parentImpact);
        }
      }
    }

    return {
      cascadeCommentIds,
      postImpact,
      parentImpact,
    };
  }

  private async findAllReplies(parentId: string) {
    const replies = [] as Comment[];
    let cursor: string | undefined;

    while (true) {
      const result = await this.commentsRepo.findReplies(parentId, 500, cursor);
      replies.push(...result.data);

      if (!result.nextCursor || result.data.length < 500) {
        break;
      }

      cursor = result.nextCursor;
    }

    return replies;
  }

  private applyCommentImpact(
    comment: Comment,
    postImpact: Map<string, PostImpact>,
    parentImpact: Map<string, { repliesDelta: number }>,
  ) {
    const postId = comment.postId;
    const prev = postImpact.get(postId) ?? {
      commentsDelta: 0,
      likesDelta: 0,
      dislikesDelta: 0,
      scoreDelta: 0,
    };

    postImpact.set(postId, {
      commentsDelta: prev.commentsDelta - 1,
      likesDelta: prev.likesDelta,
      dislikesDelta: prev.dislikesDelta,
      scoreDelta:
        prev.scoreDelta -
        (comment.parentId
          ? POST_SCORE_WEIGHTS.REPLY
          : POST_SCORE_WEIGHTS.COMMENT),
    });

    if (comment.parentId) {
      const prevParent = parentImpact.get(comment.parentId) ?? {
        repliesDelta: 0,
      };

      parentImpact.set(comment.parentId, {
        repliesDelta: prevParent.repliesDelta - 1,
      });
    }
  }

  private emptyPlan() {
    return {
      cascadeCommentIds: [] as string[],
      postImpact: new Map<string, PostImpact>(),
      parentImpact: new Map<string, { repliesDelta: number }>(),
    };
  }
}
