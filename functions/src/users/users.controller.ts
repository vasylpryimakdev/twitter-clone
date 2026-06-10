import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { FirebaseAuthGuard } from "../common/guards/firebase-auth.guard";
import { RequestWithUser } from "../common/types/request-with-user";

@Controller("users")
export class UsersController {
  @UseGuards(FirebaseAuthGuard)
  @Get("me")
  getMe(@Req() req: RequestWithUser) {
    return req.user;
  }
}
