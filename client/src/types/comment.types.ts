import type { InfiniteData } from "@tanstack/react-query";
import type { Author } from "./user.types";
import type { CommentsResponse } from "../services/comments.service";

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

export type UpdateCommentVariables = {
  commentId: string;
  text: string;
};

export type UpdateCommentContext = {
  previousComments: InfiniteData<CommentsResponse> | undefined;
};
