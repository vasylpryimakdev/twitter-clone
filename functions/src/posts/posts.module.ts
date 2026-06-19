import { forwardRef, Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { ReactionsModule } from "../reactions/reactions.module";
import { AuthModule } from "../auth/auth.module";
import FirebaseModule from "../common/firestore/firestore.module";
import { CommentsModule } from "../comments/comments.module";
import { PostDeletionService } from "./post-deletion.service";
import { UsersModule } from "../users/users.module";
@Module({
  imports: [
    FirebaseModule,
    ReactionsModule,
    AuthModule,
    forwardRef(() => CommentsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, PostDeletionService],
  exports: [PostsRepository, PostsService],
})
export class PostsModule {}
