import { api } from "../api/api";
import type { PostFormData } from "../shared/schemas/post-schema";
import type { Post } from "../types/post.types";

export type PostsFeedResponse = {
  data: Post[];
  nextCursor: string | null;
};

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

  createPost: async (data: PostFormData) => {
    const payload = {
      ...data,
      imageUrl: data.imageUrl
        ? data.imageUrl
        : "https://i.pravatar.cc/150?img=1",
    };

    const res = await api.post("/posts", payload);
    return res.data;
  },

  updatePost: async (id: string, data: PostFormData) => {
    const payload = {
      ...data,
      imageUrl: data.imageUrl ? data.imageUrl : null,
    };

    const res = await api.patch(`/posts/${id}`, payload);
    return res.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};
