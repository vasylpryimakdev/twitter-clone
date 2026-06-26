import { Injectable } from "@nestjs/common";

import { FieldValue } from "firebase-admin/firestore";
import { PostsRepository } from "../../posts/posts.repository";
import { ReactionsRepository } from "../../reactions/reactions.repository";

@Injectable()
export class ReactionDeletionExecutor {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly reactionsRepo: ReactionsRepository,
  ) {}

  apply(tx: FirebaseFirestore.Transaction, plan: any) {
    const deleted = new Set(plan.reactionIds ?? []);

    // =========================
    // 1. DELETE REACTIONS
    // =========================
    for (const id of plan.reactionIds ?? []) {
      tx.delete(this.reactionsRepo.getRef(id));
    }

    // =========================
    // 2. UPDATE POSTS IMPACT
    // =========================
    const postImpact = plan.postImpact ?? new Map();

    for (const [postId, impact] of postImpact.entries()) {
      if (!postId || !impact) continue;

      if (deleted.has(postId)) continue;

      tx.update(this.postsRepo.getRef(postId), {
        likesCount: FieldValue.increment(impact.likesDelta ?? 0),
        dislikesCount: FieldValue.increment(impact.dislikesDelta ?? 0),
        score: FieldValue.increment(impact.scoreDelta ?? 0),
      });
    }
  }
}
