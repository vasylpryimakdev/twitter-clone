import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";

import { PostsService } from "./posts.service";
import { PostDto } from "./dto/post-dto";
import { CurrentUser } from "../decorators/current-user.decorator";
import { AuthUser } from "../common/types/auth-user.type";
import { ReactionDto } from "../reactions/dto/reaction-dto";
import { Public } from "../decorators/public.decorator";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: PostDto) {
    return this.postsService.create(user.id, dto);
  }

  @Get()
  @Public()
  findFeed(
    @CurrentUser() user: AuthUser,
    @Query("limit") limit = "10",
    @Query("cursor") cursor?: string,
    @Query("search") search?: string,
    @Query("userId") userId?: string,
  ) {
    return this.postsService.findPosts({
      limit: Number(limit),
      cursor,
      search,
      userId,
      viewerId: user?.id,
    });
  }

  @Get("me")
  findMyPosts(
    @CurrentUser() user: AuthUser,
    @Query("limit") limit = "10",
    @Query("cursor") cursor?: string,
    @Query("search") search?: string,
  ) {
    return this.postsService.findPosts({
      userId: user.id,
      viewerId: user.id,
      limit: Number(limit),
      cursor,
      search,
    });
  }

  @Get("user/:userId")
  findByUser(
    @Param("userId") userId: string,
    @Req() req: any,
    @Query("limit") limit = "10",
    @Query("cursor") cursor?: string,
    @Query("search") search?: string,
  ) {
    return this.postsService.findPosts({
      userId,
      limit: Number(limit),
      cursor,
      search,
      viewerId: req.user?.id,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: AuthUser,
    @Param("id") postId: string,
    @Body() dto: PostDto,
  ) {
    return this.postsService.update(user.id, postId, dto);
  }

  @Delete(":id")
  delete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.postsService.delete(user.id, id);
  }

  @Post(":id/reactions")
  react(
    @CurrentUser() user: AuthUser,
    @Param("id") postId: string,
    @Body() dto: ReactionDto,
  ) {
    return this.postsService.react(user.id, postId, dto.type);
  }
}
