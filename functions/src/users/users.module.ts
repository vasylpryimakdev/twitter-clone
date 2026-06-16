import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthModule } from "../auth/auth.module";
import { UsersRepository } from "./users.respository";
import FirebaseModule from "../common/firestore/firestore.module";

@Module({
  imports: [FirebaseModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
