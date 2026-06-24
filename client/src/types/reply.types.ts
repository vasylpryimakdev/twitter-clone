import type { Author } from "./user.types";

export type Reply = {
  id: string;
  text: string;
  postId: string;
  authorId: string;
  parentId: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
};
