import { api } from "../api/api";
import type { Post, PostDTO, PostsFeedResponse } from "../types/post.types";

export const postsService = {
  getPosts: async (params?: {
    cursor?: string | null;
  }): Promise<PostsFeedResponse> => {
    const res = await api.get<PostsFeedResponse>("/posts", {
      params: {
        cursor: params?.cursor ?? null,
      },
    });

    return res.data;
  },

  getPostsByUser: async (
    userId: string,
    cursor?: string,
  ): Promise<PostsFeedResponse> => {
    const res = await api.get<PostsFeedResponse>(`/posts/user/${userId}`, {
      params: { cursor },
    });

    return res.data;
  },

  getMyPosts: async (cursor?: string): Promise<PostsFeedResponse> => {
    const res = await api.get<PostsFeedResponse>("/posts/me", {
      params: { cursor },
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
