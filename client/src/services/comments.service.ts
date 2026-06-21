import { api } from "../api/api";
import type { Comment } from "../types/comment.types";

export type CreateCommentDto = {
  postId: string;
  text: string;
  parentId?: string | null;
};

class CommentsService {
  async getByPostId(postId: string): Promise<Comment[]> {
    const { data } = await api.get(`/comments/post/${postId}`);
    return data;
  }

  async create(dto: CreateCommentDto): Promise<Comment> {
    const { data } = await api.post(`/comments`, dto);
    return data;
  }

  async delete(commentId: string): Promise<{ success: boolean }> {
    const { data } = await api.delete(`/comments/${commentId}`);
    return data;
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
