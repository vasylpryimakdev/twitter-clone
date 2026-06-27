import { Injectable } from "@nestjs/common";
import { ReactionsRepository } from "../../reactions/reactions.repository";
import { PostDeletionPlan } from "../types/post";
import { CommentDeletionPlanner } from "../comments/planner";
import { POST_SCORE_WEIGHTS } from "../../posts/posts.constants";

@Injectable()
export class PostDeletionPlanner {
  constructor(
    private readonly reactionsRepo: ReactionsRepository,
    private readonly commentDeletionPlanner: CommentDeletionPlanner,
  ) {}

  async buildPostDeletionPlan(postId: string): Promise<PostDeletionPlan> {
    const commentPlan = await this.commentDeletionPlanner.buildByPost(postId);
    const reactions = await this.reactionsRepo.findByPost(postId);
    const reactionIds = reactions.data.map((r) => r.id);
    const postImpact = new Map(commentPlan.postImpact);

    for (const r of reactions.data) {
      const prev = postImpact.get(postId) ?? {
        commentsDelta: 0,
        likesDelta: 0,
        dislikesDelta: 0,
        scoreDelta: 0,
      };

      if (r.type === "like") {
        prev.likesDelta -= 1;
        prev.scoreDelta -= POST_SCORE_WEIGHTS.LIKE;
      }

      if (r.type === "dislike") {
        prev.dislikesDelta -= 1;
        prev.scoreDelta -= POST_SCORE_WEIGHTS.DISLIKE;
      }

      postImpact.set(postId, prev);
    }

    return {
      postId,

      cascadeCommentIds: commentPlan.cascadeCommentIds,
      postImpact,
      parentImpact: commentPlan.parentImpact,

      reactionIds,
    };
  }
}
