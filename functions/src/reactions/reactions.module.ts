import { Module } from "@nestjs/common";
import { ReactionsRepository } from "./reactions.repository";
import FirebaseModule from "../common/firestore/firestore.module";
@Module({
  imports: [FirebaseModule],
  providers: [ReactionsRepository],
  exports: [ReactionsRepository],
})
export class ReactionsModule {}
