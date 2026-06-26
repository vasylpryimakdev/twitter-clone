import { Injectable } from "@nestjs/common";
import { PostsRepository } from "../posts/posts.repository";
import { CommentsRepository } from "../comments/comments.repository";
import { ReactionsRepository } from "../reactions/reactions.repository";
import { UsersRepository } from "../users/users.repository";
import { FieldValue, Transaction } from "firebase-admin/firestore";

@Injectable()
export class DeletionExecutor {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly commentsRepo: CommentsRepository,
    private readonly reactionsRepo: ReactionsRepository,
    private readonly usersRepo: UsersRepository,
  ) {}

  async applyPlan(tx: Transaction, plan: any, userId: string) {
    // =====================================================
    // 1. DELETE DATA (unchanged)
    // =====================================================
    for (const postId of plan.postIds ?? []) {
      tx.delete(this.postsRepo.getRef(postId));
    }

    for (const commentId of plan.postCommentIds ?? []) {
      tx.delete(this.commentsRepo.getRef(commentId));
    }

    for (const reactionId of plan.postReactionIds ?? []) {
      tx.delete(this.reactionsRepo.getRef(reactionId));
    }

    for (const commentId of plan.userCommentIds ?? []) {
      tx.delete(this.commentsRepo.getRef(commentId));
    }

    for (const replyId of plan.orphanCommentIds ?? []) {
      tx.delete(this.commentsRepo.getRef(replyId));
    }

    for (const reactionId of plan.userReactionIds ?? []) {
      tx.delete(this.reactionsRepo.getRef(reactionId));
    }

    // =====================================================
    // 2. APPLY DELTA IMPACT (your current system)
    // =====================================================
    const postImpact = plan.postImpact ?? new Map();

    for (const [postId, impact] of postImpact.entries()) {
      if (!postId || !impact) continue;

      const ref = this.postsRepo.getRef(postId);

      tx.update(ref, {
        commentsCount: FieldValue.increment(impact.commentsDelta ?? 0),
        likesCount: FieldValue.increment(
          impact.likesDelta ?? 0,
        ),
        dislikesCount: FieldValue.increment(
          impact.dislikesDelta ?? 0,
        ),
        score: FieldValue.increment(impact.scoreDelta ?? 0),
      });
    }

    // =====================================================
    // 3. FINAL SAFETY STEP (🔥 NEW)
    // =====================================================
    await this.reconcileDeletedPosts(tx, plan.postIds ?? []);

    // =====================================================
    // 4. DELETE USER
    // =====================================================
    tx.delete(this.usersRepo.getRef(userId));
  }

  // =====================================================
  // SAFETY RECONCILIATION (THE FIX)
  // =====================================================
  private async reconcileDeletedPosts(tx: Transaction, postIds: string[]) {
    for (const postId of postIds) {
      const comments = await this.commentsRepo.findByPost(postId);
      const reactions = await this.reactionsRepo.findByPost(postId);

      const ref = this.postsRepo.getRef(postId);

      tx.update(ref, {
        commentsCount: comments.length,
        likesCount: reactions.data.filter((r) => r.type === "like").length,
        dislikesCount: reactions.data.filter((r) => r.type === "dislike")
          .length,
        score: this.calculateScore(reactions.data),
      });
    }
  }

  private calculateScore(reactions: any[]) {
    return reactions.reduce((sum, r) => {
      if (r.type === "like") return sum + 1;
      if (r.type === "dislike") return sum - 1;
      return sum;
    }, 0);
  }
}
