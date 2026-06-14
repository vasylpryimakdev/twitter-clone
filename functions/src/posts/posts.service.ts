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
import { CreatePostInput } from "./types/create-post-input.type";

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async create(authorId: string, dto: CreatePostDto): Promise<Post> {
    const post: CreatePostInput = {
      authorId,

      title: dto.title,
      text: dto.text,
      imageUrl: dto.imageUrl ?? null,
    };

    return this.postsRepository.create(post);
  }

  async findOne(id: string): Promise<Post> {
    return await this.postsRepository.findById(id);
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

    return this.postsRepository.update(postId, dto);
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
