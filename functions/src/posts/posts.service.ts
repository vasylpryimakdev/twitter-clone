import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PostDto } from "./dto/post-dto";
import { Post } from "./types/post.entity";
import { PostsRepository } from "./posts.repository";
import { WritePostModel } from "./types/write-post.model";
import { FieldValue, Transaction } from "firebase-admin/firestore";
import { PostDeletionService } from "./post-deletion.service";
import {
  Reaction,
  ReactionType,
  ReactionTypes,
} from "../reactions/reaction.entity";
import { PostCounterFields } from "./types/post-counter-field";
import { ReactionsRepository } from "../reactions/reactions.repository";
import { UsersService } from "../users/services/users.service";
import { FirestoreService } from "../common/firebase/firebase.service";
import { StorageService } from "../common/firebase/storage/storage.service";

@Injectable()
export class PostsService {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly storageService: StorageService,
    private readonly postsRepository: PostsRepository,
    private readonly postDeletionService: PostDeletionService,
    private readonly reactionsRepository: ReactionsRepository,
    private readonly usersService: UsersService,
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
      searchField: `${dto.title} ${dto.text}`.toLowerCase(),

      image: dto.image ? { ...dto.image } : null,

      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,

      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await this.postsRepository.create(post.id, post);

    return await this.postsRepository.findByIdOrThrow(post.id);
  }

  async findPosts(params: {
    userId?: string;
    viewerId?: string;
    search?: string;
    limit: number;
    cursor?: string;
  }) {
    const { userId, viewerId, search, limit, cursor } = params;

    const { docs, nextCursor, hasNextPage } =
      await this.postsRepository.findPosts({
        userId,
        search,
        limit,
        cursor,
      });

    const postIds = docs.map((p) => p.id);

    let reactions: Reaction[] = [];

    if (viewerId && postIds.length) {
      reactions = await this.reactionsRepository.findByUserAndPostIds(
        viewerId,
        postIds,
      );
    }

    const reactionMap = new Map<string, "like" | "dislike">();

    for (const r of reactions) {
      reactionMap.set(r.postId, r.type);
    }

    return {
      data: docs.map((post) => ({
        ...post,
        userReaction: reactionMap.get(post.id) ?? null,
      })),
      nextCursor,
      hasNextPage,
    };
  }

  async findOne(id: string): Promise<Omit<Post, "image">> {
    return await this.postsRepository.findByIdOrThrow(id);
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

    return await this.postsRepository.findByIdOrThrow(postId);
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

  async react(userId: string, postId: string, type: ReactionType) {
    return this.firestoreService.runTransaction(async (tx) => {
      await this.postsRepository.getDataOrThrow(postId, tx);

      const existing = await this.reactionsRepository.get(postId, userId, tx);

      const currentType = existing?.type ?? null;

      if (currentType === type) {
        await this.reactionsRepository.deleteReaction(postId, userId, tx);

        await this.adjust(postId, currentType, -1, tx);
        return;
      }

      if (!currentType) {
        await this.reactionsRepository.setReaction(postId, userId, type, tx);
        await this.adjust(postId, type, +1, tx);
        return;
      }

      await this.reactionsRepository.setReaction(postId, userId, type, tx);

      await this.adjust(postId, currentType, -1, tx);
      await this.adjust(postId, type, +1, tx);
    });
  }

  private async adjust(
    postId: string,
    type: ReactionType,
    delta: number,
    tx: Transaction,
  ) {
    if (type === ReactionTypes.LIKE) {
      await this.postsRepository.adjustCounter(
        postId,
        PostCounterFields.LIKES,
        delta,
        tx,
      );
    }

    if (type === ReactionTypes.DISLIKE) {
      await this.postsRepository.adjustCounter(
        postId,
        PostCounterFields.DISLIKES,
        delta,
        tx,
      );
    }
  }
}
