import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Post,
} from "@nestjs/common";

import { UsersService } from "./services/users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CurrentUser } from "../decorators/current-user.decorator";
import { AuthUser } from "../common/types/auth-user.type";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Public } from "../decorators/public.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  getMe(@CurrentUser() user: AuthUser) {
    return this.usersService.getById(user.id);
  }

  @Post("me")
  createMe(@CurrentUser() user: AuthUser, @Body() body: CreateUserDto) {
    return this.usersService.createProfile(user, body);
  }

  @Patch("me")
  updateMe(@CurrentUser() user: AuthUser, @Body() body: UpdateUserDto) {
    return this.usersService.updateProfile(user.id, body);
  }

  @Delete("me")
  deleteMe(@CurrentUser() user: AuthUser) {
    return this.usersService.deleteProfile(user.id);
  }

  @Public()
  @Get(":id")
  getUser(@Param("id") id: string) {
    return this.usersService.getById(id);
  }
}
