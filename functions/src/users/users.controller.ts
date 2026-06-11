import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
  Param,
  Post,
} from "@nestjs/common";

import { UsersService } from "./users.service";
import { FirebaseAuthGuard } from "../common/guards/firebase-auth.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RequestWithUser } from "../common/types/request-with-user";
import { CreateUserDto } from "./dto/create-user.dto";

@UseGuards(FirebaseAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("")
  getAllUsers() {
    return { status: "success" };
  }

  @Get("me")
  getMe(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Post("me")
  createMe(@Req() req: RequestWithUser, @Body() body: CreateUserDto) {
    return this.usersService.createUserProfile(
      req.user.uid,
      req.user.email,
      body,
    );
  }

  @Patch("me")
  updateMe(@Req() req: RequestWithUser, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(req.user.uid, body);
  }

  @Delete("me")
  deleteMe(@Req() req: RequestWithUser) {
    return this.usersService.deleteUser(req.user.uid);
  }

  @Get(":id")
  getUser(@Param("id") id: string) {
    return this.usersService.getById(id);
  }
}
