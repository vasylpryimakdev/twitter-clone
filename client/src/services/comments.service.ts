import { api } from "../api/api";
import type { Comment } from "../types/comment.types";

export type CreateCommentDto = {
  text: string;
};

export type CommentsResponse = {
  data: Comment[];
  nextCursor: string | null;
};

class CommentsService {
  async getByPostId(
    postId: string,
    cursor?: string | null,
    limit = 20,
  ): Promise<CommentsResponse> {
    const { data } = await api.get(`/comments/post/${postId}`, {
      params: {
        cursor,
        limit,
      },
    });

    return data;
  }

  async create(postId: string, dto: CreateCommentDto): Promise<Comment> {
    const { data } = await api.post(`/comments/post/${postId}`, dto);
    return data;
  }

  async delete(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  }

  async update(commentId: string, text: string): Promise<Comment> {
    const { data } = await api.patch(`/comments/${commentId}`, {
      text,
    });

    return data;
  }

  async like(commentId: string): Promise<void> {
    await api.post(`/comments/${commentId}/like`);
  }

  async dislike(commentId: string): Promise<void> {
    await api.post(`/comments/${commentId}/dislike`);
  }
}

export const commentsService = new CommentsService();
