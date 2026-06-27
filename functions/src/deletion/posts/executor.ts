import { FieldValue, Transaction } from "firebase-admin/firestore";
import { Injectable } from "@nestjs/common";

import { PostsRepository } from "../../posts/posts.repository";
import { ReactionsRepository } from "../../reactions/reactions.repository";
import { CommentDeletionExecutor } from "../comments/executor";
import { PostDeletionPlan } from "../types/post";

@Injectable()
export class PostDeletionExecutor {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly reactionsRepo: ReactionsRepository,
    private readonly commentDeletionExecutor: CommentDeletionExecutor,
  ) {}

  async applyPlan(tx: Transaction, plan: PostDeletionPlan) {
    await this.commentDeletionExecutor.applyPlan(tx, {
      cascadeCommentIds: plan.cascadeCommentIds,
      postImpact: plan.postImpact,
      parentImpact: plan.parentImpact,
      ignoredPostIds: [plan.postId],
    });

    for (const [postId, impact] of plan.postImpact) {
      if (!postId || !impact || postId === plan.postId) continue;

      tx.update(this.postsRepo.getRef(postId), {
        commentsCount: FieldValue.increment(impact.commentsDelta),
        likesCount: FieldValue.increment(impact.likesDelta),
        dislikesCount: FieldValue.increment(impact.dislikesDelta),
        score: FieldValue.increment(impact.scoreDelta),
      });
    }

    for (const id of plan.reactionIds) {
      tx.delete(this.reactionsRepo.getRef(id));
    }

    tx.delete(this.postsRepo.getRef(plan.postId));
  }
}
