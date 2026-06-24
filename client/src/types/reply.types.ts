import type { InfiniteData } from "@tanstack/react-query";
import type { CommentsResponse } from "../services/comments.service";
import type { RepliesResponse } from "../services/replies.service";
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

export type DeleteReplyContext = {
  previousReplies: InfiniteData<RepliesResponse> | undefined;
  previousComments: InfiniteData<CommentsResponse> | undefined;
  previousPosts: [unknown, unknown][];
};
