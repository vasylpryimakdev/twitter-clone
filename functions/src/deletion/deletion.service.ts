import { Injectable } from "@nestjs/common";
import { FirestoreService } from "../common/firebase/firebase.service";
import { UserDeletionPlanner } from "./user-deletion/user-deletion-planner";
import { UserDeletionExecutor } from "./user-deletion/user-deletion-executor";
import { StorageCleanupService } from "./services/storage-clean-up.service";
import { PostDeletionPlanner } from "./post-deletion/planner";
import { PostDeletionExecutor } from "./post-deletion/executor";

@Injectable()
export class DeletionService {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly storage: StorageCleanupService,
    private readonly userDeletionPlanner: UserDeletionPlanner,
    private readonly userDeletionExecutor: UserDeletionExecutor,
    private readonly postDeletionPlanner: PostDeletionPlanner,
    private readonly postDeletionExecutor: PostDeletionExecutor,
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
}
