import { Module } from "@nestjs/common";
import { FirestoreModule } from "../common/firestore/firestore.module";

import { CommentsController } from "./comments.controller";
import { CommentsRepository } from "./comments.repository";
import { CommentsApplicationService } from "./comments-application.service";

@Module({
  imports: [FirestoreModule],
  controllers: [CommentsController],
  providers: [CommentsRepository, CommentsApplicationService],
  exports: [CommentsRepository],
})
export class CommentsModule {}
