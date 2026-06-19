import type { PostUser } from "./user.types";

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
  imageUrl?: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  createdAt: string;
};
