import type { Author } from "./user.types";

export type Reply = {
  id: string;
  text: string;
  authorId: string;
  author: Author;
  repliesCount: number;
};

export type RepliesResponse = {
  data: Reply[];
  nextCursor: string | null;
};
