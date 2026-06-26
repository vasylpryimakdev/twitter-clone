import { Injectable } from "@nestjs/common";
import { PostsRepository } from "../posts/posts.repository";
import { CommentsRepository } from "../comments/comments.repository";
import { ReactionsRepository } from "../reactions/reactions.repository";
import { UsersRepository } from "../users/users.repository";
import { FieldValue } from "firebase-admin/firestore";

@Injectable()
export class DeletionExecutor {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly commentsRepo: CommentsRepository,
    private readonly reactionsRepo: ReactionsRepository,
    private readonly usersRepo: UsersRepository,
  ) {}

  async applyPlan(
    tx: FirebaseFirestore.Transaction,
    plan: any,
    userId: string,
  ) {
    const postDeleteSet = new Set(plan.postIds ?? []);
    const commentDeleteSet = new Set(plan.userCommentIds ?? []);

    // =====================================================
    // 1. DELETE POSTS
    // =====================================================
    for (const postId of plan.postIds ?? []) {
      if (!postId) continue;
      tx.delete(this.postsRepo.getRef(postId));
    }

    // =====================================================
    // 2. DELETE COMMENTS UNDER POSTS
    // =====================================================
    for (const commentId of plan.postCommentIds ?? []) {
      if (!commentId) continue;
      commentDeleteSet.add(commentId);
      tx.delete(this.commentsRepo.getRef(commentId));
    }

    // =====================================================
    // 3. DELETE REACTIONS UNDER POSTS
    // =====================================================
    for (const reactionId of plan.postReactionIds ?? []) {
      if (!reactionId) continue;
      tx.delete(this.reactionsRepo.getRef(reactionId));
    }

    // =====================================================
    // 4. DELETE USER COMMENTS
    // =====================================================
    for (const commentId of plan.userCommentIds ?? []) {
      if (!commentId) continue;
      tx.delete(this.commentsRepo.getRef(commentId));
    }

    // =====================================================
    // 5. DELETE ORPHAN REPLIES
    // =====================================================
    for (const replyId of plan.orphanCommentIds ?? []) {
      if (!replyId) continue;
      tx.delete(this.commentsRepo.getRef(replyId));
    }

    // =====================================================
    // 6. DELETE USER REACTIONS
    // =====================================================
    for (const reactionId of plan.userReactionIds ?? []) {
      if (!reactionId) continue;
      tx.delete(this.reactionsRepo.getRef(reactionId));
    }

    // =====================================================
    // 7. UPDATE POSTS (🔥 FIXED)
    // =====================================================
    const postImpact = plan.postImpact ?? new Map();

    for (const [postId, impact] of postImpact.entries()) {
      if (!postId || !impact) continue;
      if (postDeleteSet.has(postId)) continue;

      const ref = this.postsRepo.getRef(postId);

      tx.update(ref, {
        commentsCount: FieldValue.increment(impact.commentsDelta ?? 0),
        likesCount: FieldValue.increment(impact.likesDelta ?? 0),
        dislikesCount: FieldValue.increment(impact.dislikesDelta ?? 0),
        score: FieldValue.increment(impact.scoreDelta ?? 0),
      });
    }

    // =====================================================
    // 8. UPDATE PARENT COMMENTS
    // =====================================================
    const parentImpact = plan.parentImpact ?? new Map();

    for (const [parentId, impact] of parentImpact.entries()) {
      if (!parentId || !impact) continue;
      if (commentDeleteSet.has(parentId)) continue;

      const ref = this.commentsRepo.getRef(parentId);

      tx.update(ref, {
        repliesCount: FieldValue.increment(impact.repliesDelta ?? 0),
      });
    }

    // =====================================================
    // 9. DELETE USER
    // =====================================================
    tx.delete(this.usersRepo.getRef(userId));
  }
}
