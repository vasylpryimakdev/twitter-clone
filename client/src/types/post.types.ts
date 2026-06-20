import type { PostUser } from "./user.types";

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
  author: PostUser;
  title: string;
  text: string;
  imageUrl: string | null;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  createdAt: string;
};
