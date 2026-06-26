import { Transaction } from "firebase-admin/firestore";
import { CommentsRepository } from "../../comments/comments.repository";
import { PostsRepository } from "../../posts/posts.repository";
import { ReactionsRepository } from "../../reactions/reactions.repository";
import { PostDeletionPlan } from "../types/post-deletion-plan";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PostDeletionExecutor {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly commentsRepo: CommentsRepository,
    private readonly reactionsRepo: ReactionsRepository,
  ) {}

  async applyPlan(tx: Transaction, plan: PostDeletionPlan) {
    // 1. delete comments + replies
    for (const id of [...plan.commentIds, ...plan.replyIds]) {
      tx.delete(this.commentsRepo.getRef(id));
    }

    // 2. delete reactions
    for (const id of plan.reactionIds) {
      tx.delete(this.reactionsRepo.getRef(id));
    }

    // 3. delete post
    tx.delete(this.postsRepo.getRef(plan.postId));
  }
}
