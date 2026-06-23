import { Module } from "@nestjs/common";
import { ReactionsRepository } from "./reactions.repository";
import { FirebaseModule } from "../common/firebase/firebase.module";
@Module({
  imports: [FirebaseModule],
  providers: [ReactionsRepository],
  exports: [ReactionsRepository],
})
export class ReactionsModule {}
