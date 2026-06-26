import { Module } from "@nestjs/common";

import { ReactionsModule } from "../reactions/reactions.module";
import { PostsModule } from "../posts/posts.module";
import { CommentsModule } from "../comments/comments.module";
import { FirebaseModule } from "../common/firebase/firebase.module";
import { DeletionService } from "./deletion.service";

import { StorageCleanupService } from "./services/storage-clean-up.service";

import { DeletionPlanner } from "./deletion-planner";
import { DeletionExecutor } from "./deletion-executor";
import { UsersRepository } from "../users/users.repository";
import { ReactionDeletionPlanner } from "./reactions-deletion/reaction-deletion-planner";
import { CommentDeletionPlanner } from "./comments-deletion/comments-deletion-planner";

@Module({
  imports: [FirebaseModule, ReactionsModule, PostsModule, CommentsModule],
  providers: [
    DeletionService,
    StorageCleanupService,
    UsersRepository,
    DeletionPlanner,
    ReactionDeletionPlanner,
    CommentDeletionPlanner,
    DeletionExecutor,
  ],
  exports: [DeletionService],
})
export class DeletionModule {}
