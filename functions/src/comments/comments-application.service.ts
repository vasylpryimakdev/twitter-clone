import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";

import { CommentsRepository } from "./comments.repository";
import { PostsRepository } from "../posts/posts.repository";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@Injectable()
export class CommentsApplicationService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createForPost(userId: string, postId: string, dto: CreateCommentDto) {
    const postRef = this.postsRepository.getRef(postId);
    const postSnap = await postRef.get();

    if (!postSnap.exists) {
      throw new NotFoundException("Post not found");
    }

    const commentId = this.commentsRepository.createId();

    const comment = {
      id: commentId,
      postId,
      userId,
      parentId: null,
      text: dto.text,
    };

    await this.commentsRepository.create(comment);

    return comment;
  }

  async reply(userId: string, parentCommentId: string, dto: CreateCommentDto) {
    const parent = await this.commentsRepository.findById(parentCommentId);

    if (!parent) {
      throw new NotFoundException("Parent comment not found");
    }

    const commentId = this.commentsRepository.createId();

    const comment = {
      id: commentId,
      postId: parent.postId,
      userId,
      parentId: parentCommentId,
      text: dto.text,
    };

    await this.commentsRepository.create(comment);

    return comment;
  }

  async update(userId: string, commentId: string, dto: UpdateCommentDto) {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException("You can update only your comments");
    }

    await this.commentsRepository.update(commentId, {
      text: dto.text,
    });

    return {
      ...comment,
      text: dto.text,
    };
  }

  async delete(userId: string, commentId: string) {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException("You can delete only your comments");
    }

    await this.commentsRepository.delete(commentId);

    return { success: true };
  }

  async getByPost(postId: string, limit: number, cursor?: string) {
    return this.commentsRepository.findByPost(postId, limit, cursor);
  }
}
