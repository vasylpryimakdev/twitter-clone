import { Injectable } from "@nestjs/common";
import { CommentsRepository } from "../../comments/comments.repository";
import { POST_SCORE_WEIGHTS } from "../../posts/posts.constants";
import { PostImpact } from "../types/post-impacty.type";

type ParentCommentImpact = {
  repliesDelta: number;
};

@Injectable()
export class CommentDeletionPlanner {
  constructor(private readonly commentsRepo: CommentsRepository) {}

  async buildByUser(userId: string) {
    const comments = await this.commentsRepo.findByAuthor(userId);

    const commentIds = comments.map((c) => c.id);

    const postImpact = new Map<string, PostImpact>();
    const parentImpact = new Map<string, ParentCommentImpact>();
    const orphanCommentIds: string[] = [];

    const visited = new Set<string>();
    const queue = [...comments.map((c) => c.id)];

    for (const id of queue) visited.add(id);

    while (queue.length) {
      const batch = queue.splice(0, 20);

      const repliesBatch = await Promise.all(
        batch.map((id) => this.commentsRepo.findReplies(id)),
      );

      for (const res of repliesBatch) {
        for (const reply of res.data) {
          if (visited.has(reply.id)) continue;
          visited.add(reply.id);

          queue.push(reply.id);

          orphanCommentIds.push(reply.id);

          const postId = reply.postId;

          const prev = postImpact.get(postId) ?? {
            commentsDelta: 0,
            likesDelta: 0,
            dislikesDelta: 0,
            scoreDelta: 0,
          };

          prev.commentsDelta -= 1;

          prev.scoreDelta -= reply.parentId
            ? POST_SCORE_WEIGHTS.REPLY
            : POST_SCORE_WEIGHTS.COMMENT;

          postImpact.set(postId, prev);

          if (reply.parentId) {
            const parent = parentImpact.get(reply.parentId) ?? {
              repliesDelta: 0,
            };

            parent.repliesDelta -= 1;
            parentImpact.set(reply.parentId, parent);
          }
        }
      }
    }

    for (const comment of comments) {
      const postId = comment.postId;

      const prev = postImpact.get(postId) ?? {
        commentsDelta: 0,
        likesDelta: 0,
        dislikesDelta: 0,
        scoreDelta: 0,
      };

      prev.commentsDelta -= 1;

      prev.scoreDelta -= comment.parentId
        ? POST_SCORE_WEIGHTS.REPLY
        : POST_SCORE_WEIGHTS.COMMENT;

      postImpact.set(postId, prev);

      if (comment.parentId) {
        const parent = parentImpact.get(comment.parentId) ?? {
          repliesDelta: 0,
        };

        parent.repliesDelta -= 1;
        parentImpact.set(comment.parentId, parent);
      }
    }

    return {
      commentIds,
      postImpact,
      parentImpact,
      orphanCommentIds,
    };
  }

  async buildByPost(postId: string) {
    const comments = await this.commentsRepo.findByPost(postId);

    return {
      commentIds: comments.map((c) => c.id),
    };
  }
}
