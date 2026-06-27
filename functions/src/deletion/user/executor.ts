import { Injectable } from "@nestjs/common";
import { FieldValue, Transaction } from "firebase-admin/firestore";

import { PostsRepository } from "../../posts/posts.repository";
import { ReactionsRepository } from "../../reactions/reactions.repository";
import { UsersRepository } from "../../users/users.repository";
import { CommentDeletionExecutor } from "../comments/executor";
import { UserDeletionPlan } from "../types/user";

@Injectable()
export class UserDeletionExecutor {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly reactionsRepo: ReactionsRepository,
    private readonly usersRepo: UsersRepository,
    private readonly commentDeletionExecutor: CommentDeletionExecutor,
  ) {}

  async applyPlan(tx: Transaction, plan: UserDeletionPlan, userId: string) {
    for (const ownedPostPlan of plan.ownedPostPlans) {
      await this.commentDeletionExecutor.applyPlan(tx, {
        cascadeCommentIds: ownedPostPlan.cascadeCommentIds,
        postImpact: ownedPostPlan.postImpact,
        parentImpact: ownedPostPlan.parentImpact,
        ignoredPostIds: [ownedPostPlan.postId],
      });

      for (const id of ownedPostPlan.reactionIds) {
        tx.delete(this.reactionsRepo.getRef(id));
      }

      tx.delete(this.postsRepo.getRef(ownedPostPlan.postId));
    }

    await this.commentDeletionExecutor.applyPlan(tx, {
      cascadeCommentIds: plan.userCommentPlan.cascadeCommentIds,
      postImpact: plan.userCommentPlan.postImpact,
      parentImpact: plan.userCommentPlan.parentImpact,
      ignoredPostIds: plan.postIds,
    });

    for (const reactionId of plan.reactionIds ?? []) {
      if (!reactionId) continue;
      tx.delete(this.reactionsRepo.getRef(reactionId));
    }

    for (const [postId, impact] of plan.postImpact) {
      tx.update(this.postsRepo.getRef(postId), {
        likesCount: FieldValue.increment(impact.likesDelta),
        dislikesCount: FieldValue.increment(impact.dislikesDelta),
        score: FieldValue.increment(impact.scoreDelta),
      });
    }

    tx.delete(this.usersRepo.getRef(userId));
  }
}
