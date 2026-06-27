import { forwardRef, Module } from "@nestjs/common";

import { ReactionsModule } from "../reactions/reactions.module";
import { CommentsModule } from "../comments/comments.module";
import { FirebaseModule } from "../common/firebase/firebase.module";
import { DeletionService } from "./deletion.service";

import { StorageCleanupService } from "./services/storage-clean-up.service";

import { UserDeletionPlanner } from "./user/planner";
import { UserDeletionExecutor } from "./user/executor";
import { UsersRepository } from "../users/users.repository";
import { ReactionDeletionPlanner } from "./reactions/planner";
import { CommentDeletionPlanner } from "./comments/planner";
import { PostDeletionPlanner } from "./posts/planner";
import { PostDeletionExecutor } from "./posts/executor";
import { PostsModule } from "../posts/posts.module";
import { CommentDeletionExecutor } from "./comments/executor";

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
    CommentDeletionPlanner,
    CommentDeletionExecutor,
    ReactionDeletionPlanner,
  ],
  exports: [DeletionService],
})
export class DeletionModule {}
