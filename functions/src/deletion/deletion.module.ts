import { forwardRef, Module } from "@nestjs/common";

import { ReactionsModule } from "../reactions/reactions.module";
import { CommentsModule } from "../comments/comments.module";
import { FirebaseModule } from "../common/firebase/firebase.module";
import { DeletionService } from "./deletion.service";

import { StorageCleanupService } from "./services/storage-clean-up.service";

import { UserDeletionPlanner } from "./user-deletion/user-deletion-planner";
import { UserDeletionExecutor } from "./user-deletion/user-deletion-executor";
import { UsersRepository } from "../users/users.repository";
import { ReactionDeletionPlanner } from "./reactions-deletion/reaction-deletion-planner";
import { CommentDeletionPlanner } from "./comments-deletion/comments-deletion-planner";
import { PostDeletionPlanner } from "./post-deletion/planner";
import { PostDeletionExecutor } from "./post-deletion/executor";
import { PostsModule } from "../posts/posts.module";

@Module({
  imports: [
    FirebaseModule,
    ReactionsModule,
    CommentsModule,
    forwardRef(() => PostsModule),
  ],
  providers: [
    DeletionService,
    StorageCleanupService,
    UsersRepository,
    UserDeletionPlanner,
    UserDeletionExecutor,
    PostDeletionPlanner,
    PostDeletionExecutor,
    ReactionDeletionPlanner,
    CommentDeletionPlanner,
  ],
  exports: [DeletionService],
})
export class DeletionModule {}
