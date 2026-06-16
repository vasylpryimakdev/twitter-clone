import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post } from "./types/post.entity";
import { PostsRepository } from "./posts.repository";
import { mapDoc } from "../common/firestore/firestore.mapper";
import { WritePostModel } from "./types/write-post.model";
import { FieldValue } from "firebase-admin/firestore";
@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async create(authorId: string, dto: CreatePostDto): Promise<Post> {
    const post: WritePostModel = {
      id: this.postsRepository.createId(),
      authorId,

      title: dto.title,
      text: dto.text,
      imageUrl: dto.imageUrl ?? null,
      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,

      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await this.postsRepository.create(post.id, post);

    return await this.postsRepository.findByIdOrThrow(post.id);
  }

  async findOne(id: string): Promise<Post> {
    return await this.postsRepository.findByIdOrThrow(id);
  }

  async findByUser(userId: string, limit = 10, cursor?: string) {
    const { docs, lastDoc } = await this.postsRepository.findByUser(
      userId,
      limit,
      cursor,
    );

    return {
      data: docs.map((doc) => mapDoc<Post>(doc)),
      nextCursor: lastDoc ? lastDoc.id : null,
    };
  }

  async update(
    userId: string,
    postId: string,
    dto: UpdatePostDto,
  ): Promise<Post> {
    const hasAtLeastOneField = Object.values(dto).some((v) => v !== undefined);

    if (!hasAtLeastOneField) {
      throw new BadRequestException("At least one field required");
    }

    const post = await this.postsRepository.findById(postId);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException("You cannot edit this post");
    }

    await this.postsRepository.update(postId, { ...dto });

    return await this.postsRepository.findByIdOrThrow(post.id);
  }

  async delete(userId: string, postId: string): Promise<void> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException("You cannot delete this post");
    }

    await this.postsRepository.delete(postId);
  }

  async findFeed(limit = 10, cursor?: string) {
    const { docs, lastDoc } = await this.postsRepository.findFeed(
      limit,
      cursor,
    );

    return {
      data: docs.map((doc) => mapDoc<Post>(doc)),
      nextCursor: lastDoc ? lastDoc.id : null,
    };
  }
}
