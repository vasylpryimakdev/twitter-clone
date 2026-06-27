import { Injectable } from "@nestjs/common";
import { PostsRepository } from "../../posts/posts.repository";
import { PostDeletionPlanner } from "../posts/planner";
import { ReactionDeletionPlanner } from "../reactions/planner";
import { CommentDeletionPlanner } from "../comments/planner";
import { PostImpact, PostDeletionPlan } from "../types/post";

@Injectable()
export class UserDeletionPlanner {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly postDeletionPlanner: PostDeletionPlanner,
    private readonly reactionPlanner: ReactionDeletionPlanner,
    private readonly commentPlanner: CommentDeletionPlanner,
  ) {}

  async buildUserDeletionPlan(userId: string) {
    const posts = await this.postsRepo.findPosts({
      userId,
      limit: 1000,
    });

    const postIds = posts.docs.map((p) => p.id);

    const ownedPostPlans: PostDeletionPlan[] = await Promise.all(
      posts.docs.map((p) =>
        this.postDeletionPlanner.buildPostDeletionPlan(p.id),
      ),
    );

    const commentPlan = await this.commentPlanner.buildByUser(userId);

    const userReactionPlan = await this.reactionPlanner.buildByUser(
      userId,
      postIds,
    );

    const postImpact = this.mergeImpacts([
      commentPlan.postImpact,
      ...ownedPostPlans.map((p) => p.postImpact),
      userReactionPlan.postImpact,
    ]);

    return {
      postIds,
      ownedPostPlans,
      reactionIds: userReactionPlan.reactionIds,
      userCommentPlan: commentPlan,
      postImpact,
    };
  }

  private mergeImpacts(
    sources: Map<string, PostImpact>[],
  ): Map<string, PostImpact> {
    const result = new Map<string, PostImpact>();

    for (const source of sources) {
      for (const [postId, impact] of source.entries()) {
        const prev = result.get(postId) ?? {
          commentsDelta: 0,
          likesDelta: 0,
          dislikesDelta: 0,
          scoreDelta: 0,
        };

        result.set(postId, {
          commentsDelta: prev.commentsDelta + impact.commentsDelta,
          likesDelta: prev.likesDelta + impact.likesDelta,
          dislikesDelta: prev.dislikesDelta + impact.dislikesDelta,
          scoreDelta: prev.scoreDelta + impact.scoreDelta,
        });
      }
    }

    return result;
  }
}
