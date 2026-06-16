export const PostCounterFields = {
  COMMENTS: "commentsCount",
  LIKES: "likesCount",
  DISLIKES: "dislikesCount",
} as const;

export type PostCounterField =
  (typeof PostCounterFields)[keyof typeof PostCounterFields];
