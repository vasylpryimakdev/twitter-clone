import { forwardRef, Module } from "@nestjs/common";

import FirebaseModule from "../common/firestore/firestore.module";
import { PostsModule } from "../posts/posts.module";
import { AuthModule } from "../auth/auth.module";

import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { CommentsRepository } from "./comments.repository";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    FirebaseModule,
    PostsModule,
    AuthModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsRepository],
})
export class CommentsModule {}
