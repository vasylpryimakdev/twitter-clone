import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";

import { FirebaseModule } from "../common/firebase/firebase.module";
import { DeletionModule } from "../deletion/deletion.module";
import { UsersService } from "./users.service";
@Module({
  imports: [FirebaseModule, DeletionModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
