import { Injectable } from "@nestjs/common";
import { ReactionsRepository } from "../../reactions/reactions.repository";
import { POST_SCORE_WEIGHTS } from "../../posts/posts.constants";
import { PostImpact } from "../types/post";

@Injectable()
export class ReactionDeletionPlanner {
  constructor(private readonly reactionsRepo: ReactionsRepository) {}

  async buildByUser(userId: string, excludePostIds: string[] = []) {
    const reactions = await this.reactionsRepo.findByUser(userId);
    const filtered = excludePostIds.length
      ? reactions.filter(
          (reaction) => !excludePostIds.includes(reaction.postId),
        )
      : reactions;

    return this.build(filtered);
  }

  async buildByPost(postId: string) {
    const reactions = await this.reactionsRepo.findByPost(postId);
    return this.build(reactions.data);
  }

  private build(reactions: any[]) {
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

      const delta =
        r.type === "like"
          ? {
              likesDelta: prev.likesDelta - 1,
              scoreDelta: prev.scoreDelta - POST_SCORE_WEIGHTS.LIKE,
              dislikesDelta: prev.dislikesDelta,
              commentsDelta: prev.commentsDelta,
            }
          : {
              likesDelta: prev.likesDelta,
              dislikesDelta: prev.dislikesDelta - 1,
              scoreDelta: prev.scoreDelta - POST_SCORE_WEIGHTS.DISLIKE,
              commentsDelta: prev.commentsDelta,
            };

      postImpact.set(postId, delta);
    }

    return {
      reactionIds,
      postImpact,
    };
  }
}
