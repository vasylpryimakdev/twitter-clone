import { Module } from "@nestjs/common";

import FirebaseModule from "../common/firestore/firestore.module";
import { PostsModule } from "../posts/posts.module";
import { AuthModule } from "../auth/auth.module";

import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { CommentsRepository } from "./comments.repository";

@Module({
  imports: [
    FirebaseModule,
    PostsModule,
    AuthModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsRepository],
})
export class CommentsModule {}
