import { Injectable } from "@nestjs/common";
import { PostsRepository } from "../posts/posts.repository";
import { CommentsRepository } from "../comments/comments.repository";
import { POST_SCORE_WEIGHTS } from "../posts/posts.constants";
import { ReactionDeletionPlanner } from "./reaction-deletion/reaction-deletion-planner";
import { PostImpact } from "./types/post-impacty.type";

type ParentCommentImpact = {
  repliesDelta: number;
};

@Injectable()
export class DeletionPlanner {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly commentsRepo: CommentsRepository,
    private readonly reactionDeletionPlanner: ReactionDeletionPlanner,
  ) {}

  async buildUserDeletionPlan(userId: string) {
    // =====================================================
    // 1. POSTS OWNED BY USER
    // =====================================================
    const posts = await this.postsRepo.findPosts({
      userId,
      limit: 1000,
    });

    const postIds = posts.docs.map((p) => p.id);

    const postCommentIds: string[] = [];
    const postReactionIds: string[] = [];

    // =====================================================
    // POST-LEVEL REACTIONS (impact + ids)
    // =====================================================
    const postReactionImpactSources: Map<string, PostImpact>[] = [];

    for (const post of posts.docs) {
      const comments = await this.commentsRepo.findByPost(post.id);

      postCommentIds.push(...comments.map((c) => c.id));

      const reactionPlan = await this.reactionDeletionPlanner.buildByPost(
        post.id,
      );

      postReactionIds.push(...reactionPlan.reactionIds);

      // IMPORTANT FIX: include impact from post reactions
      postReactionImpactSources.push(reactionPlan.postImpact);
    }

    // =====================================================
    // 2. COMMENTS WRITTEN BY USER
    // =====================================================
    const userComments = await this.commentsRepo.findByAuthor(userId);

    const userCommentIds = userComments.map((c) => c.id);

    const orphanCommentIds: string[] = [];
    const parentImpact = new Map<string, ParentCommentImpact>();
    const commentPostImpact = new Map<string, PostImpact>();

    for (const comment of userComments) {
      const post = commentPostImpact.get(comment.postId) ?? {
        commentsDelta: 0,
        likesDelta: 0,
        dislikesDelta: 0,
        scoreDelta: 0,
      };

      post.commentsDelta--;

      post.scoreDelta -= comment.parentId
        ? POST_SCORE_WEIGHTS.REPLY
        : POST_SCORE_WEIGHTS.COMMENT;

      commentPostImpact.set(comment.postId, post);

      if (comment.parentId) {
        const parent = parentImpact.get(comment.parentId) ?? {
          repliesDelta: 0,
        };

        parent.repliesDelta--;
        parentImpact.set(comment.parentId, parent);
      }

      if (comment.repliesCount > 0) {
        const replies = await this.commentsRepo.findReplies(comment.id);
        orphanCommentIds.push(...replies.data.map((r) => r.id));
      }
    }

    // =====================================================
    // 3. USER REACTIONS (impact + ids)
    // =====================================================
    const userReactionPlan =
      await this.reactionDeletionPlanner.buildByUser(userId);

    const userReactionIds = userReactionPlan.reactionIds;

    const userReactionImpact = userReactionPlan.postImpact;

    // =====================================================
    // 4. MERGE ALL POST IMPACTS
    // =====================================================
    const postImpact = new Map<string, PostImpact>();

    const merge = (source: Map<string, PostImpact>) => {
      for (const [postId, impact] of source.entries()) {
        const prev = postImpact.get(postId) ?? {
          commentsDelta: 0,
          likesDelta: 0,
          dislikesDelta: 0,
          scoreDelta: 0,
        };

        postImpact.set(postId, {
          commentsDelta: prev.commentsDelta + impact.commentsDelta,
          likesDelta: prev.likesDelta + impact.likesDelta,
          dislikesDelta: prev.dislikesDelta + impact.dislikesDelta,
          scoreDelta: prev.scoreDelta + impact.scoreDelta,
        });
      }
    };

    // merge all sources (IMPORTANT FIX)
    merge(commentPostImpact);
    merge(userReactionImpact);

    for (const source of postReactionImpactSources) {
      merge(source);
    }

    // =====================================================
    // FINAL PLAN
    // =====================================================
    return {
      postIds,

      postCommentIds,
      userCommentIds,
      orphanCommentIds,

      postReactionIds,
      userReactionIds,

      postImpact,
      parentImpact,
    };
  }
}
