import { Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { FirebaseAuthGuard } from "../auth/guards/firebase-auth.guard";
import { AuthService } from "../auth/auth.service";

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, AuthService, FirebaseAuthGuard],
})
export class PostsModule {}
