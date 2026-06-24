import type { QueryKey } from "@tanstack/react-query";
import type { ReactionType } from "../services/reactions.service";
import type { Author } from "./user.types";

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

export type PostImage = {
  url: string;
  path: string;
};

export type PostDTO = {
  title: string;
  text: string;
  image?: PostImage | null;
};

export type PostsFeedResponse = {
  data: Post[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

export type PostsQueryData = {
  data: Post[];
};

export type ReactPostVariables = {
  postId: string;
  type: ReactionType;
};

export type MutationPostsContext = {
  previous: [QueryKey, PostsQueryData | undefined][];
};
