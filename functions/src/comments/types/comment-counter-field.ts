export const CommentCounterFields = {
  REPLIES: "repliesCount",
} as const;

export type CommentCounterField =
  (typeof CommentCounterFields)[keyof typeof CommentCounterFields];
