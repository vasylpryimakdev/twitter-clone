import { Controller, Post, Delete, Param, UseGuards } from "@nestjs/common";
import { ReactionsService } from "./reactions.service";
import { AuthGuard } from "../auth/guards/firebase-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { AuthUser } from "../auth/types/auth-user.type";

@Controller("posts")
@UseGuards(AuthGuard)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post(":id/like")
  like(@Param("id") postId: string, @CurrentUser() user: AuthUser) {
    return this.reactionsService.like(postId, user.id);
  }

  @Post(":id/dislike")
  dislike(@Param("id") postId: string, @CurrentUser() user: AuthUser) {
    return this.reactionsService.dislike(postId, user.id);
  }

  @Delete(":id/reaction")
  remove(@Param("id") postId: string, @CurrentUser() user: AuthUser) {
    return this.reactionsService.remove(postId, user.id);
  }
}
