import { forwardRef, Module } from "@nestjs/common";
import { ReactionsRepository } from "./reactions.repository";
import { FirebaseModule } from "../common/firebase/firebase.module";
import { PostsModule } from "../posts/posts.module";
@Module({
  imports: [FirebaseModule, forwardRef(() => PostsModule)],
  providers: [ReactionsRepository],
  exports: [ReactionsRepository],
})
export class ReactionsModule {}
