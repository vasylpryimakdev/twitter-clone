import type { InfiniteData } from "@tanstack/react-query";
import type { Author } from "./user.types";

export type PostsInfinite = InfiniteData<PostsFeedResponse>;

export type PostsFeedResponse = {
  data: Post[];
  nextCursor: string | null;
};

export type PostImage = {
  url: string;
  path: string;
};

export type PostDTO = {
  title: string;
  text: string;
  image?: PostImage | null;
};

export type Post = {
  id: string;
  authorId: string;
  author: Author;
  title: string;
  text: string;
  image: PostImage | null;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  createdAt: string;
  userReaction: "like" | "dislike" | null;
};
