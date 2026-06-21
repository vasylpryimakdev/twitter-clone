import type { Author } from "./user.types";

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  author: Author;
  parentId: string | null;
  text: string;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
};
