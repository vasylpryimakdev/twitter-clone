import { api } from "../api/api";
import type { CreatePostFormData } from "../shared/schemas/create-post.schema";
import type { Post } from "../types/post.types";

type PostsResponse = {
  data: Post[];
  nextCursor: string | null;
};

export const postsService = {
  getPosts: async (): Promise<PostsResponse> => {
    const res = await api.get("/posts");
    return res.data;
  },

  createPost: async (data: CreatePostFormData) => {
    const payload = {
      ...data,
      imageUrl: data.imageUrl
        ? data.imageUrl
        : "https://i.pravatar.cc/150?img=1",
    };

    const res = await api.post("/posts", payload);
    return res.data;
  },
};
