import { api } from "../api/api";
import type { Reply } from "../types/reply.types";

export type CreateReplyDto = {
  text: string;
};

export type RepliesResponse = {
  data: Reply[];
  nextCursor: string | null;
};

class RepliesService {
  async getByCommentId(
    commentId: string,
    cursor?: string | null,
    limit = 20,
  ): Promise<RepliesResponse> {
    const { data } = await api.get(`/comments/${commentId}/replies`, {
      params: {
        cursor,
        limit,
      },
    });

    return data;
  }

  async create(commentId: string, dto: CreateReplyDto): Promise<Reply> {
    const { data } = await api.post(`/comments/${commentId}/reply`, dto);

    return data;
  }

  async delete(replyId: string): Promise<void> {
    await api.delete(`/comments/${replyId}`);
  }

  async update(replyId: string, text: string): Promise<Reply> {
    const { data } = await api.patch(`/comments/${replyId}`, {
      text,
    });

    return data;
  }
}

export const repliesService = new RepliesService();
