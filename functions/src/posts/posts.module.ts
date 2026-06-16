import { Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { ReactionsModule } from "../reactions/reactions.module";
import { AuthModule } from "../auth/auth.module";
import FirebaseModule from "../common/firestore/firestore.module";
@Module({
  imports: [FirebaseModule, ReactionsModule, AuthModule],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsRepository],
})
export class PostsModule {}
