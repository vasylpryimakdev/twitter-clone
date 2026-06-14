import { Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { AuthGuard } from "../auth/guards/firebase-auth.guard";
import { AuthService } from "../auth/auth.service";
import { ReactionsService } from "../reactions/reactions.service";
import { ReactionsRepository } from "../reactions/reactions.repository";

@Module({
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    AuthService,
    AuthGuard,
    ReactionsService,
    ReactionsRepository,
  ],
})
export class PostsModule {}
