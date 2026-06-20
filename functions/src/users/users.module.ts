import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthModule } from "../auth/auth.module";
import { UsersRepository } from "./users.respository";
import FirebaseModule from "../common/firestore/firestore.module";
import { UserDeletionService } from "./user-deletion.service";
import { CommentsModule } from "../comments/comments.module";
import { PostsModule } from "../posts/posts.module";
import { ReactionsModule } from "../reactions/reactions.module";
import { StorageModule } from "../storage/storage.module";

@Module({
  imports: [
    FirebaseModule,
    AuthModule,
    PostsModule,
    CommentsModule,
    ReactionsModule,
    StorageModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserDeletionService],
  exports: [UsersService],
})
export class UsersModule {}
