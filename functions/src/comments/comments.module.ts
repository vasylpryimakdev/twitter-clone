import { forwardRef, Module } from "@nestjs/common";

import { PostsModule } from "../posts/posts.module";

import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { CommentsRepository } from "./comments.repository";
import { UsersModule } from "../users/users.module";
import { FirebaseModule } from "../common/firebase/firebase.module";

@Module({
  imports: [
    FirebaseModule,
    PostsModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsRepository],
})
export class CommentsModule {}
