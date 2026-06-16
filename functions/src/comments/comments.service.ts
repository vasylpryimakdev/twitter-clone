import { Injectable, ForbiddenException, Inject } from "@nestjs/common";

import { CommentsRepository } from "./comments.repository";
import { PostsRepository } from "../posts/posts.repository";

import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { FieldValue, Firestore } from "firebase-admin/firestore";
import { FIRESTORE } from "../common/firestore/firestore.provider";
import { WriteComment } from "./types/write-comment.model";
import { PostCounterFields } from "../posts/types/post-counter-field";
import { CommentCounterFields } from "./types/comment-counter-field";
@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    @Inject(FIRESTORE)
    private readonly firestore: Firestore,
  ) {}

  async createForPost(userId: string, postId: string, dto: CreateCommentDto) {
    const commentId = this.commentsRepository.createId();

    await this.firestore.runTransaction(async (tx) => {
      await this.postsRepository.getDataOrThrow(postId, tx);

      const comment: WriteComment = {
        id: commentId,
        authorId: userId,
        postId,
        parentId: null,
        text: dto.text,
        repliesCount: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await this.commentsRepository.create(comment.id, comment, tx);

      await this.postsRepository.adjustCounter(
        postId,
        PostCounterFields.COMMENTS,
        1,
        tx,
      );

      return comment;
    });

    return this.commentsRepository.findByIdOrThrow(commentId);
  }

  async createReply(userId: string, parentId: string, dto: CreateCommentDto) {
    const commentId = this.commentsRepository.createId();

    await this.firestore.runTransaction(async (tx) => {
      const parent = await this.commentsRepository.getDataOrThrow(parentId, tx);

      const reply: WriteComment = {
        id: commentId,
        authorId: userId,
        postId: parent.postId,
        parentId,
        text: dto.text,
        repliesCount: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await this.commentsRepository.create(reply.id, reply, tx);

      await this.postsRepository.adjustCounter(
        reply.postId,
        PostCounterFields.COMMENTS,
        +1,
        tx,
      );

      await this.commentsRepository.adjustCounter(
        parentId,
        CommentCounterFields.REPLIES,
        +1,
        tx,
      );
    });

    return this.commentsRepository.findByIdOrThrow(commentId);
  }

  findByPost(postId: string, limit = 20, cursor?: string) {
    return this.commentsRepository.findByPost(postId, limit, cursor);
  }

  findReplies(parentId: string, limit = 20, cursor?: string) {
    return this.commentsRepository.findReplies(parentId, limit, cursor);
  }

  async updateComment(
    authorId: string,
    commentId: string,
    dto: UpdateCommentDto,
  ) {
    const comment = await this.commentsRepository.findByIdOrThrow(commentId);

    if (comment.authorId !== authorId) {
      throw new ForbiddenException("Forbidden");
    }

    await this.commentsRepository.update(commentId, { ...dto });

    return this.commentsRepository.findById(commentId);
  }

  async delete(authorId: string, commentId: string) {
    return this.firestore.runTransaction(async (tx) => {
      const comment = await this.commentsRepository.getDataOrThrow(
        commentId,
        tx,
      );

      if (comment.authorId !== authorId) {
        throw new ForbiddenException("Forbidden");
      }

      const post = await this.postsRepository.getDataOrThrow(
        comment.postId,
        tx,
      );

      await this.commentsRepository.delete(commentId, tx);

      await this.postsRepository.adjustCounter(
        post.id,
        PostCounterFields.COMMENTS,
        -1,
        tx,
      );

      if (comment.parentId) {
        await this.commentsRepository.adjustCounter(
          comment.parentId,
          CommentCounterFields.REPLIES,
          -1,
          tx,
        );
      }

      return { success: true };
    });
  }
}
