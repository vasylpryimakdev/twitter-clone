import { Injectable } from "@nestjs/common";
import { FieldValue, Transaction } from "firebase-admin/firestore";

import { CommentsRepository } from "../../comments/comments.repository";
import { PostsRepository } from "../../posts/posts.repository";
import { CommentDeletionPlan } from "../types/comment";

@Injectable()
export class CommentDeletionExecutor {
  constructor(
    private readonly commentsRepo: CommentsRepository,
    private readonly postsRepo: PostsRepository,
  ) {}

  async applyPlan(tx: Transaction, plan: CommentDeletionPlan) {
    const ignoredPostIds = new Set(plan.ignoredPostIds ?? []);

    for (const [postId, impact] of plan.postImpact) {
      if (!postId || !impact || ignoredPostIds.has(postId)) continue;

      tx.update(this.postsRepo.getRef(postId), {
        commentsCount: FieldValue.increment(impact.commentsDelta),
        likesCount: FieldValue.increment(impact.likesDelta),
        dislikesCount: FieldValue.increment(impact.dislikesDelta),
        score: FieldValue.increment(impact.scoreDelta),
      });
    }

    for (const [parentId, impact] of plan.parentImpact) {
      if (!parentId || !impact) continue;

      tx.update(this.commentsRepo.getRef(parentId), {
        repliesCount: FieldValue.increment(impact.repliesDelta),
      });
    }

    const deleteSet = new Set(plan.cascadeCommentIds);

    for (const commentId of deleteSet) {
      tx.delete(this.commentsRepo.getRef(commentId));
    }
  }
}
