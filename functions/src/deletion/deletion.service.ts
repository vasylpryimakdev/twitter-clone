import { Injectable } from "@nestjs/common";
import { FirestoreService } from "../common/firebase/firebase.service";

import { StorageCleanupService } from "./services/storage-clean-up.service";

import { UserDeletionPlanner } from "./user/planner";
import { UserDeletionExecutor } from "./user/executor";

import { PostDeletionPlanner } from "./posts/planner";
import { PostDeletionExecutor } from "./posts/executor";

import { CommentDeletionPlanner } from "./comments/planner";
import { CommentDeletionExecutor } from "./comments/executor";

@Injectable()
export class DeletionService {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly storage: StorageCleanupService,

    private readonly userDeletionPlanner: UserDeletionPlanner,
    private readonly userDeletionExecutor: UserDeletionExecutor,

    private readonly postDeletionPlanner: PostDeletionPlanner,
    private readonly postDeletionExecutor: PostDeletionExecutor,

    private readonly commentDeletionPlanner: CommentDeletionPlanner,
    private readonly commentDeletionExecutor: CommentDeletionExecutor,
  ) {}

  async deleteUser(userId: string) {
    const plan = await this.userDeletionPlanner.buildUserDeletionPlan(userId);

    await this.firestoreService.runTransaction(async (tx) => {
      await this.userDeletionExecutor.applyPlan(tx, plan, userId);
    });

    await this.storage.deleteUserFiles(userId);
  }

  async deletePost(postId: string) {
    const plan = await this.postDeletionPlanner.buildPostDeletionPlan(postId);

    await this.firestoreService.runTransaction(async (tx) => {
      await this.postDeletionExecutor.applyPlan(tx, plan);
    });
  }

  async deleteComment(commentId: string) {
    const plan = await this.commentDeletionPlanner.buildByComment(commentId);

    await this.firestoreService.runTransaction(async (tx) => {
      await this.commentDeletionExecutor.applyPlan(tx, plan);
    });
  }
}
