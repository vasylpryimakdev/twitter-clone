import { Injectable } from "@nestjs/common";
import { ReactionsRepository } from "../../reactions/reactions.repository";
import { POST_SCORE_WEIGHTS } from "../../posts/posts.constants";
import { PostImpact } from "../types/post-impacty.type";

@Injectable()
export class ReactionDeletionPlanner {
  constructor(private readonly reactionsRepo: ReactionsRepository) {}

  async buildByUser(userId: string) {
    const reactions = await this.reactionsRepo.findByUser(userId);

    const reactionIds = reactions.map((r) => r.id);

    const postImpact = new Map<string, PostImpact>();

    for (const r of reactions) {
      const postId = r.postId;

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
      reactionIds,
      postImpact,
    };
  }

  async buildByPost(postId: string) {
    const reactions = await this.reactionsRepo.findByPost(postId);

    const reactionIds = reactions.data.map((r) => r.id);

    const postImpact = new Map<string, PostImpact>();

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
      reactionIds,
      postImpact,
    };
  }
}
