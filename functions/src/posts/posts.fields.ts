export const PostCounterFields = {
  COMMENTS: "commentsCount",
  LIKES: "likesCount",
  DISLIKES: "dislikesCount",
  SCORE: "score",
} as const;

export type PostCounterField =
  (typeof PostCounterFields)[keyof typeof PostCounterFields];
