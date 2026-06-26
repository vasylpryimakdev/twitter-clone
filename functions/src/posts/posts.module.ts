import { forwardRef, Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { ReactionsModule } from "../reactions/reactions.module";
import { CommentsModule } from "../comments/comments.module";
import { UsersModule } from "../users/users.module";
import { FirebaseModule } from "../common/firebase/firebase.module";
import { DeletionModule } from "../deletion/deletion.module";
@Module({
  imports: [
    FirebaseModule,
    forwardRef(() => DeletionModule),
    forwardRef(() => ReactionsModule),
    forwardRef(() => CommentsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsRepository, PostsService],
})
export class PostsModule {}
