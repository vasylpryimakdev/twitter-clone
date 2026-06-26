import { Injectable } from "@nestjs/common";
import { FirestoreService } from "../common/firebase/firebase.service";
import { DeletionPlanner } from "./deletion-planner";
import { DeletionExecutor } from "./deletion-executor";
import { StorageCleanupService } from "./services/storage-clean-up.service";

@Injectable()
export class DeletionService {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly planner: DeletionPlanner,
    private readonly executor: DeletionExecutor,
    private readonly storage: StorageCleanupService,
  ) {}

  async deleteUser(userId: string) {
    const plan = await this.planner.buildUserDeletionPlan(userId);

    await this.firestoreService.runTransaction(async (tx) => {
      await this.executor.applyPlan(tx, plan, userId);
    });

    await this.storage.deleteUserFiles(userId);
  }
}
