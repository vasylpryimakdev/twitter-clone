import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post } from "./types/post.entity";
import { PostsRepository } from "./posts.repository";
import { mapDoc } from "../common/firestore/firestore.mapper";
import { WritePostModel } from "./types/write-post.model";
import { FieldValue, Firestore } from "firebase-admin/firestore";
import { PostDeletionService } from "./post-deletion.service";
import { FIRESTORE } from "../common/firestore/firestore.provider";
import { ReactionType, ReactionTypes } from "../reactions/reaction.entity";
import { PostCounterFields } from "./types/post-counter-field";
import { ReactionsRepository } from "../reactions/reactions.repository";
import { UsersService } from "../users/users.service";
@Injectable()
export class PostsService {
  constructor(
    @Inject(FIRESTORE) private readonly firestore: Firestore,
    private readonly postsRepository: PostsRepository,
    private readonly postDeletionService: PostDeletionService,
    private readonly reactionsRepository: ReactionsRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: string, dto: CreatePostDto): Promise<Post> {
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
    const { data, lastDoc } = await this.postsRepository.findByUser(
      userId,
      limit,
      cursor,
    );

    return {
      data,
      nextCursor: lastDoc,
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

    const user = await this.usersService.getById(userId);

    if (!user) {
      throw new NotFoundException(
        "Unable to create post. User does not exist.",
      );
    }

    const post = await this.postsRepository.findById(postId);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException("You cannot edit this post");
    }

    await this.postsRepository.update(postId, {
      ...dto,
      author: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        username: user.username,
        ...(user.avatar ? { avatar: user.avatar } : {}),
      },
    });

    return await this.postsRepository.findByIdOrThrow(post.id);
  }

  async delete(userId: string, postId: string): Promise<void> {
    const post = await this.postsRepository.findByIdOrThrow(postId);

    if (post.authorId !== userId) {
      throw new ForbiddenException("You cannot delete this post");
    }

    await this.postDeletionService.deletePost(postId);
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
