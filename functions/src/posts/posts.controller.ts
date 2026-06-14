import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { AuthGuard } from "../auth/guards/firebase-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { AuthUser } from "../auth/types/auth-user.type";
import { ReactionsService } from "../reactions/reactions.service";
import { ReactionDto } from "../reactions/dto/reaction-dto";

@Controller("posts")
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly reactionsService: ReactionsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePostDto) {
    return this.postsService.create(user.id, dto);
  }

  @Get()
  findFeed(@Query("limit") limit = 10, @Query("cursor") cursor?: string) {
    return this.postsService.findFeed(Number(limit), cursor);
  }

  @Get("me")
  @UseGuards(AuthGuard)
  findMyPosts(
    @CurrentUser() user: AuthUser,
    @Query("limit") limit = 10,
    @Query("cursor") cursor?: string,
  ) {
    return this.postsService.findByUser(user.id, Number(limit), cursor);
  }

  @Get("user/:userId")
  findByUser(
    @Param("userId") userId: string,
    @Query("limit") limit = 10,
    @Query("cursor") cursor?: string,
  ) {
    return this.postsService.findByUser(userId, Number(limit), cursor);
  }

  @Post(":id/reaction")
  @UseGuards(AuthGuard)
  react(
    @Param("id") postId: string,
    @Body() dto: ReactionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reactionsService.react(postId, user.id, dto.type);
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
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(user.id, postId, dto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  delete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.postsService.delete(user.id, id);
  }
}
