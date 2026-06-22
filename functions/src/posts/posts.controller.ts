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
  UseGuards,
} from "@nestjs/common";

import { PostsService } from "./posts.service";
import { PostDto } from "./dto/post-dto";
import { AuthGuard } from "../auth/guards/firebase-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { AuthUser } from "../auth/types/auth-user.type";
import { ReactionDto } from "../reactions/dto/reaction-dto";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@CurrentUser() user: AuthUser, @Body() dto: PostDto) {
    return this.postsService.create(user.id, dto);
  }

  @Get()
  findFeed(
    @Req() req: any,
    @Query("limit") limit = "10",
    @Query("cursor") cursor?: string,
    @Query("search") search?: string,
  ) {
    return this.postsService.findPosts({
      limit: Number(limit),
      cursor,
      search,
      viewerId: req.user?.id,
    });
  }

  @Get("me")
  @UseGuards(AuthGuard)
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
      viewerId: req.user?.id,
      limit: Number(limit),
      cursor,
      search,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  update(
    @CurrentUser() user: AuthUser,
    @Param("id") postId: string,
    @Body() dto: PostDto,
  ) {
    return this.postsService.update(user.id, postId, dto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  delete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.postsService.delete(user.id, id);
  }

  @Post(":id/reactions")
  @UseGuards(AuthGuard)
  react(
    @CurrentUser() user: AuthUser,
    @Param("id") postId: string,
    @Body() dto: ReactionDto,
  ) {
    return this.postsService.react(user.id, postId, dto.type);
  }
}
