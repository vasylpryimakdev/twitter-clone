import { Injectable, ForbiddenException } from "@nestjs/common";

import { CommentsRepository } from "./comments.repository";
import { PostsRepository } from "../posts/posts.repository";

import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { FieldValue } from "firebase-admin/firestore";
import { WriteComment } from "./types/write-comment.model";
import { CommentCounterFields } from "./types/comment-counter-field";
import { UsersRepository } from "../users/users.repository";
import { FirestoreService } from "../common/firebase/firebase.service";
import { PostCounterFields } from "../posts/posts.fields";
import { POST_SCORE_WEIGHTS } from "../posts/posts.constants";
import { DeletionService } from "../deletion/deletion.service";
@Injectable()
export class CommentsService {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly deletionService: DeletionService,
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createForPost(userId: string, postId: string, dto: CreateCommentDto) {
    const commentId = this.commentsRepository.createId();

    const user = await this.usersRepository.findByIdOrThrow(userId);

    const comment: WriteComment = {
      id: commentId,

      authorId: userId,

      author: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        username: user.username,
        avatar: user.avatar ?? null,
      },

      postId,
      parentId: dto.parentId ?? null,
      text: dto.text,
      repliesCount: 0,

      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await this.firestoreService.runTransaction(async (tx) => {
      await this.postsRepository.getDataOrThrow(postId, tx);

      await this.commentsRepository.create(comment.id, comment, tx);

      await this.postsRepository.adjustCounter(
        postId,
        PostCounterFields.COMMENTS,
        1,
        tx,
      );

      await this.postsRepository.adjustCounter(
        postId,
        PostCounterFields.SCORE,
        POST_SCORE_WEIGHTS.COMMENT,
        tx,
      );
    });

    return this.commentsRepository.findByIdOrThrow(commentId);
  }

  async createReply(userId: string, parentId: string, dto: CreateCommentDto) {
    const commentId = this.commentsRepository.createId();

    const user = await this.usersRepository.findByIdOrThrow(userId);

    await this.firestoreService.runTransaction(async (tx) => {
      const parent = await this.commentsRepository.getDataOrThrow(parentId, tx);

      const reply: WriteComment = {
        id: commentId,
        authorId: userId,
        author: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          username: user.username,
          avatar: user.avatar ?? null,
        },

        postId: parent.postId,
        parentId,
        text: dto.text,
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

      await this.postsRepository.adjustCounter(
        reply.postId,
        PostCounterFields.SCORE,
        POST_SCORE_WEIGHTS.COMMENT,
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
    return this.commentsRepository.findTopLevelByPost(postId, limit, cursor);
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
    const comment = await this.commentsRepository.findByIdOrThrow(commentId);

    if (comment.authorId !== authorId) {
      throw new ForbiddenException("Forbidden");
    }

    await this.deletionService.deleteComment(commentId);

    return { success: true };
  }
}
