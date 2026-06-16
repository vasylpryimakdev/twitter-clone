import { Module } from "@nestjs/common";
import { ReactionsRepository } from "./reactions.repository";
import { ReactionApplicationService } from "./reaction-application.service";
import FirebaseModule from "../common/firestore/firestore.module";
import { PostsRepository } from "../posts/posts.repository";

@Module({
  imports: [FirebaseModule],
  providers: [ReactionsRepository, ReactionApplicationService, PostsRepository],
  exports: [ReactionApplicationService],
})
export class ReactionsModule {}
