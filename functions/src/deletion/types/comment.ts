import { PostImpact } from "./post";

export type ParentCommentImpact = {
  repliesDelta: number;
};

export type CommentDeletionPlan = {
  cascadeCommentIds: string[];
  postImpact: Map<string, PostImpact>;
  parentImpact: Map<string, ParentCommentImpact>;
  ignoredPostIds?: string[];
};
