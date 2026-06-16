import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from "@nestjs/common";

import { AuthGuard } from "../auth/guards/firebase-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { AuthUser } from "../auth/types/auth-user.type";

import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post("post/:postId")
  @UseGuards(AuthGuard)
  createForPost(
    @Param("postId") postId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.createForPost(user.id, postId, dto);
  }

  @Post(":commentId/reply")
  @UseGuards(AuthGuard)
  reply(
    @Param("commentId") commentId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.createReply(user.id, commentId, dto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  update(
    @Param("id") commentId: string,
    @Body() dto: UpdateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.update(user.id, commentId, dto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  delete(@Param("id") commentId: string, @CurrentUser() user: AuthUser) {
    return this.commentsService.delete(user.id, commentId);
  }

  @Get("post/:postId")
  getByPost(
    @Param("postId") postId: string,
    @Query("cursor") cursor?: string,
    @Query("limit") limit?: string,
  ) {
    return this.commentsService.findByPost(postId, Number(limit ?? 20), cursor);
  }

  @Get(":commentId/replies")
  getReplies(
    @Param("commentId") commentId: string,
    @Query("cursor") cursor?: string,
    @Query("limit") limit?: string,
  ) {
    return this.commentsService.findReplies(
      commentId,
      Number(limit ?? 20),
      cursor,
    );
  }
}
