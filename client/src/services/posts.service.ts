import { api } from "../api/api";
import type { Post, PostDTO, PostsFeedResponse } from "../types/post.types";

export const postsService = {
  getPosts: async (params?: {
    cursor?: string | null;
    limit?: number;
    userId?: string;
    search?: string;
  }): Promise<PostsFeedResponse> => {
    const res = await api.get<PostsFeedResponse>("/posts", {
      params: {
        cursor: params?.cursor ?? null,
        limit: params?.limit ?? 10,
        userId: params?.userId,
        search: params?.search,
      },
    });

    return res.data;
  },

  getPostById: async (id: string): Promise<Post> => {
    const res = await api.get(`/posts/${id}`);
    return res.data;
  },

  createPost: async (data: PostDTO) => {
    const res = await api.post("/posts", data);
    return res.data;
  },

  updatePost: async (id: string, data: PostDTO) => {
    const res = await api.patch(`/posts/${id}`, data);
    return res.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};
