import type { PostUser } from "./user.types";

export type Post = {
  id: string;
  user: PostUser;
  title: string;
  text: string;
  image?: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  createdAt: string;
};
