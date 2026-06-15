import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from "@nestjs/common";

import { CommentsRepository } from "./comments.repository";
import { PostsRepository } from "../posts/posts.repository";

import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { FieldValue, Firestore } from "firebase-admin/firestore";
import { FIRESTORE } from "../common/firestore/firestore.provider";

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    @Inject(FIRESTORE)
    private readonly firestore: Firestore,
  ) {}

  async createForPost(userId: string, postId: string, dto: CreateCommentDto) {
    const postRef = this.postsRepository.getRef(postId);

    return this.firestore.runTransaction(async (tx) => {
      const postSnap = await tx.get(postRef);

      if (!postSnap.exists) {
        throw new NotFoundException("Post not found");
      }

      const commentId = this.commentsRepository.createId();
      const commentRef = this.commentsRepository.getRef(commentId);

      const comment = {
        id: commentId,
        postId,
        userId,
        parentId: null,
        text: dto.text,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      tx.set(commentRef, comment);

      tx.update(postRef, {
        commentsCount: FieldValue.increment(1),
      });

      return comment;
    });
  }

  async reply(userId: string, parentId: string, dto: CreateCommentDto) {
    const parent = await this.commentsRepository.findById(parentId);

    if (!parent) {
      throw new NotFoundException("Parent comment not found");
    }

    const postRef = this.postsRepository.getRef(parent.postId);
    const parentRef = this.commentsRepository.getRef(parentId);

    return this.firestore.runTransaction(async (tx) => {
      const [postSnap, parentSnap] = await Promise.all([
        tx.get(postRef),
        tx.get(parentRef),
      ]);

      if (!postSnap.exists) {
        throw new NotFoundException("Post not found");
      }

      if (!parentSnap.exists) {
        throw new NotFoundException("Parent comment not found");
      }

      const commentId = this.commentsRepository.createId();
      const commentRef = this.commentsRepository.getRef(commentId);

      const comment = {
        id: commentId,
        postId: parent.postId,
        userId,
        parentId,
        text: dto.text,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      tx.set(commentRef, comment);

      tx.update(postRef, {
        commentsCount: FieldValue.increment(1),
      });

      tx.update(parentRef, {
        repliesCount: FieldValue.increment(1),
      });

      return comment;
    });
  }

  findByPost(postId: string, limit = 20, cursor?: string) {
    return this.commentsRepository.findByPost(postId, limit, cursor);
  }

  findReplies(parentId: string, limit = 20, cursor?: string) {
    return this.commentsRepository.findReplies(parentId, limit, cursor);
  }

  async update(userId: string, commentId: string, dto: UpdateCommentDto) {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException("Forbidden");
    }

    await this.commentsRepository.update(commentId, dto);

    return this.commentsRepository.findById(commentId);
  }

  async delete(userId: string, commentId: string) {
    const commentRef = this.commentsRepository.getRef(commentId);

    return this.firestore.runTransaction(async (tx) => {
      const commentSnap = await tx.get(commentRef);

      if (!commentSnap.exists) {
        throw new NotFoundException("Comment not found");
      }

      const comment = commentSnap.data();

      if (!comment) {
        throw new NotFoundException("Comment data is empty");
      }

      if (comment.userId !== userId) {
        throw new ForbiddenException("Forbidden");
      }

      const postRef = this.postsRepository.getRef(comment.postId);
      const postSnap = await tx.get(postRef);

      if (!postSnap.exists) {
        throw new NotFoundException("Post not found");
      }

      const parentRef = comment.parentId
        ? this.commentsRepository.getRef(comment.parentId)
        : null;

      const parentSnap = parentRef ? await tx.get(parentRef) : null;

      tx.delete(commentRef);

      tx.update(postRef, {
        commentsCount: FieldValue.increment(-1),
      });

      if (parentRef && parentSnap?.exists) {
        tx.update(parentRef, {
          repliesCount: FieldValue.increment(-1),
        });
      }

      return { success: true };
    });
  }
}
