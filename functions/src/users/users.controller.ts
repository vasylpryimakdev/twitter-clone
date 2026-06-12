import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Param,
  Post,
} from "@nestjs/common";

import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthGuard } from "../auth/guards/firebase-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { AuthUser } from "../auth/types/auth-user.type";

@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  getMe(@CurrentUser() user: AuthUser) {
    return this.usersService.getById(user.id);
  }

  @Post("me")
  createMe(@CurrentUser() user: AuthUser, @Body() body: CreateUserDto) {
    return this.usersService.createUserProfile(user, body);
  }

  @Patch("me")
  updateMe(@CurrentUser() user: AuthUser, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(user.id, body);
  }

  @Delete("me")
  deleteMe(@CurrentUser() user: AuthUser) {
    return this.usersService.deleteUser(user.id);
  }

  @Get(":id")
  getUser(@Param("id") id: string) {
    return this.usersService.getById(id);
  }
}
