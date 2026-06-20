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

export interface PostAuthorSnapshot {
  id: string;
  name: string;
  surname: string;
  username: string;
  avatar?: string;
}

export type Post = {
  id: string;
  user: PostUser;
  authorId: string;
  author: PostAuthorSnapshot;
  title: string;
  text: string;
  imageUrl: string | null;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  createdAt: string;
};
