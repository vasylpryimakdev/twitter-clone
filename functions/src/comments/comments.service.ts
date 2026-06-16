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
import { CreateComment } from "./types/create-comment.type";
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

      const comment: CreateComment = {
        id: this.commentsRepository.createId(),
        authorId: userId,
        postId,
        parentId: null,
        text: dto.text,
        repliesCount: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await this.commentsRepository.create(comment.id, comment, tx);

      this.postsRepository.incrementComments(tx, postId);

      return comment;
    });
  }

  async reply(userId: string, parentId: string, dto: CreateCommentDto) {
    return this.firestore.runTransaction(async (tx) => {
      const parent = await this.commentsRepository.getDataOrThrow(tx, parentId);

      const reply: CreateComment = {
        id: this.commentsRepository.createId(),
        authorId: userId,
        postId: parent.postId,
        parentId,
        text: dto.text,
        repliesCount: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await this.commentsRepository.create(reply.id, reply, tx);

      this.commentsRepository.incrementRepliesCount(tx, parentId);

      return reply;
    });
  }

  findByPost(postId: string, limit = 20, cursor?: string) {
    return this.commentsRepository.findByPost(postId, limit, cursor);
  }

  findReplies(parentId: string, limit = 20, cursor?: string) {
    return this.commentsRepository.findReplies(parentId, limit, cursor);
  }

  async update(authorId: string, commentId: string, dto: UpdateCommentDto) {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    if (comment.authorId !== authorId) {
      throw new ForbiddenException("Forbidden");
    }

    await this.commentsRepository.update(commentId, dto);

    return this.commentsRepository.findById(commentId);
  }

  async delete(authorId: string, commentId: string) {
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

      if (comment.userId !== authorId) {
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
