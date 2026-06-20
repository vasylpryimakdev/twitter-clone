import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { PostDto } from "./dto/post-dto";
import { Post } from "./types/post.entity";
import { PostsRepository } from "./posts.repository";
import { WritePostModel } from "./types/write-post.model";
import { FieldValue, Firestore } from "firebase-admin/firestore";
import { PostDeletionService } from "./post-deletion.service";
import { FIRESTORE } from "../common/firestore/firestore.provider";
import { ReactionType, ReactionTypes } from "../reactions/reaction.entity";
import { PostCounterFields } from "./types/post-counter-field";
import { ReactionsRepository } from "../reactions/reactions.repository";
import { UsersService } from "../users/users.service";
import { StorageService } from "../storage/storage.service";
import { toPostResponse } from "./mappers/post.response.mapper";

@Injectable()
export class PostsService {
  constructor(
    @Inject(FIRESTORE) private readonly firestore: Firestore,
    private readonly postsRepository: PostsRepository,
    private readonly postDeletionService: PostDeletionService,
    private readonly reactionsRepository: ReactionsRepository,
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  async create(userId: string, dto: PostDto): Promise<Omit<Post, "image">> {
    const user = await this.usersService.getById(userId);

    if (!user) {
      throw new NotFoundException(
        "Unable to create post. User does not exist.",
      );
    }

    const post: WritePostModel = {
      id: this.postsRepository.createId(),
      authorId: userId,
      author: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        username: user.username,
        ...(user.avatar ? { avatar: user.avatar } : {}),
      },

      title: dto.title,
      text: dto.text,

      image: dto.image ? { ...dto.image } : null,

      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,

      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await this.postsRepository.create(post.id, post);

    const createdPost = await this.postsRepository.findByIdOrThrow(post.id);

    return toPostResponse(createdPost);
  }

  async findOne(id: string): Promise<Omit<Post, "image">> {
    const post = await this.postsRepository.findByIdOrThrow(id);
    return toPostResponse(post);
  }

  async findByUser(userId: string, limit = 10, cursor?: string) {
    const { docs, lastDoc } = await this.postsRepository.findByUser(
      userId,
      limit,
      cursor,
    );

    return {
      data: docs.map((post) => toPostResponse(post)),
      nextCursor: lastDoc,
    };
  }

  async update(
    userId: string,
    postId: string,
    dto: PostDto,
  ): Promise<Omit<Post, "image">> {
    const hasAtLeastOneField = Object.values(dto).some((v) => v !== undefined);

    if (!hasAtLeastOneField) {
      throw new BadRequestException("At least one field required");
    }

    const user = await this.usersService.getById(userId);

    if (!user) {
      throw new NotFoundException(
        "Unable to update post. User does not exist.",
      );
    }

    const post = await this.postsRepository.findById(postId);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException("You cannot edit this post");
    }

    let image = post.image;

    if (dto.image === null) {
      if (post.image) {
        await this.storageService.deleteFile(post.image.path);
      }

      image = null;
    }

    if (dto.image) {
      if (post.image) {
        await this.storageService.deleteFile(post.image.path);
      }
      image = { ...dto.image };
    }

    const updateData: Partial<WritePostModel> = {
      ...dto,
      image,
      author: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        username: user.username,
        ...(user.avatar ? { avatar: user.avatar } : {}),
      },

      updatedAt: FieldValue.serverTimestamp(),
    };

    await this.postsRepository.update(postId, updateData);

    const updatedPost = await this.postsRepository.findByIdOrThrow(postId);

    return toPostResponse(updatedPost);
  }

  async delete(userId: string, postId: string): Promise<void> {
    const post = await this.postsRepository.findByIdOrThrow(postId);

    if (post.authorId !== userId) {
      throw new ForbiddenException("You cannot delete this post");
    }

    if (post.image) {
      await this.storageService.deleteFile(post.image.path);
    }

    await this.postDeletionService.deletePost(postId);
  }

  async findFeed(limit = 10, cursor?: string) {
    const { docs, lastDoc } = await this.postsRepository.findFeed(
      limit,
      cursor,
    );

    return {
      data: docs.map((post) => toPostResponse(post)),
      nextCursor: lastDoc,
    };
  }

  async react(userId: string, postId: string, type: ReactionType) {
    return this.firestore.runTransaction(async (tx) => {
      await this.postsRepository.getDataOrThrow(postId, tx);

      const existing = await this.reactionsRepository.get(postId, userId, tx);

      const currentType = existing?.type ?? null;

      if (currentType === type) {
        await this.reactionsRepository.delete(postId, userId, tx);

        if (type === ReactionTypes.LIKE) {
          await this.postsRepository.adjustCounter(
            postId,
            PostCounterFields.LIKES,
            -1,
            tx,
          );
        }

        if (type === ReactionTypes.DISLIKE) {
          await this.postsRepository.adjustCounter(
            postId,
            PostCounterFields.DISLIKES,
            -1,
            tx,
          );
        }

        return;
      }

      if (!currentType) {
        await this.reactionsRepository.set(postId, userId, type, tx);

        if (type === ReactionTypes.LIKE) {
          await this.postsRepository.adjustCounter(
            postId,
            PostCounterFields.LIKES,
            1,
            tx,
          );
        }

        if (type === ReactionTypes.DISLIKE) {
          await this.postsRepository.adjustCounter(
            postId,
            PostCounterFields.DISLIKES,
            1,
            tx,
          );
        }

        return;
      }

      await this.reactionsRepository.set(postId, userId, type, tx);

      if (currentType === ReactionTypes.LIKE) {
        await this.postsRepository.adjustCounter(
          postId,
          PostCounterFields.LIKES,
          -1,
          tx,
        );
      }

      if (currentType === ReactionTypes.DISLIKE) {
        await this.postsRepository.adjustCounter(
          postId,
          PostCounterFields.DISLIKES,
          -1,
          tx,
        );
      }

      if (type === ReactionTypes.LIKE) {
        await this.postsRepository.adjustCounter(
          postId,
          PostCounterFields.LIKES,
          1,
          tx,
        );
      }

      if (type === ReactionTypes.DISLIKE) {
        await this.postsRepository.adjustCounter(
          postId,
          PostCounterFields.DISLIKES,
          1,
          tx,
        );
      }
    });
  }
}
