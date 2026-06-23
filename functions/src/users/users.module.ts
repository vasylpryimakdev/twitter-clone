import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersRepository } from "./users.repository";
import { UserDeletionService } from "./user-deletion.service";
import { CommentsModule } from "../comments/comments.module";
import { PostsModule } from "../posts/posts.module";
import { ReactionsModule } from "../reactions/reactions.module";
import { FirebaseModule } from "../common/firebase/firebase.module";

@Module({
  imports: [FirebaseModule, PostsModule, CommentsModule, ReactionsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserDeletionService],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
