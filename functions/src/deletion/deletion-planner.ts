import { Injectable } from "@nestjs/common";
import { PostsRepository } from "../posts/posts.repository";
import { CommentsRepository } from "../comments/comments.repository";
import { ReactionDeletionPlanner } from "./reactions-deletion/reaction-deletion-planner";
import { PostImpact } from "./types/post-impacty.type";
import { CommentDeletionPlanner } from "./comments-deletion/comments-deletion-planner";

@Injectable()
export class DeletionPlanner {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly commentsRepo: CommentsRepository,
    private readonly reactionDeletionPlanner: ReactionDeletionPlanner,
    private readonly commentDeletionPlanner: CommentDeletionPlanner,
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

    const postReactionImpactSources: Map<string, PostImpact>[] = [];

    for (const post of posts.docs) {
      const comments = await this.commentsRepo.findByPost(post.id);

      postCommentIds.push(...comments.map((c) => c.id));

      const reactionPlan = await this.reactionDeletionPlanner.buildByPost(
        post.id,
      );

      postReactionIds.push(...reactionPlan.reactionIds);

      postReactionImpactSources.push(reactionPlan.postImpact);
    }

    // =====================================================
    // 2. COMMENTS WRITTEN BY USER (NOW DELEGATED)
    // =====================================================
    const commentPlan = await this.commentDeletionPlanner.buildByUser(userId);

    const userCommentIds = commentPlan.commentIds;
    const orphanCommentIds = commentPlan.orphanCommentIds;
    const commentPostImpact = commentPlan.postImpact;
    const parentImpact = commentPlan.parentImpact;

    // =====================================================
    // 3. USER REACTIONS
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
