import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { CurrentUser } from "../decorators/current-user.decorator";
import { AuthUser } from "../common/types/auth-user.type";

import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Public } from "../decorators/public.decorator";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post("post/:postId")
  createForPost(
    @Param("postId") postId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.createForPost(user.id, postId, dto);
  }

  @Post(":commentId/reply")
  reply(
    @Param("commentId") commentId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.createReply(user.id, commentId, dto);
  }

  @Patch(":id")
  update(
    @Param("id") commentId: string,
    @Body() dto: UpdateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.updateComment(user.id, commentId, dto);
  }

  @Delete(":id")
  delete(@Param("id") commentId: string, @CurrentUser() user: AuthUser) {
    return this.commentsService.delete(user.id, commentId);
  }

  @Get("post/:postId")
  @Public()
  getByPost(
    @Param("postId") postId: string,
    @Query("cursor") cursor?: string,
    @Query("limit") limit?: string,
  ) {
    return this.commentsService.findByPost(postId, Number(limit ?? 20), cursor);
  }

  @Get(":commentId/replies")
  @Public()
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
