export type PostDeletionPlan = {
  postId: string;

  commentIds: string[];
  replyIds: string[];

  reactionIds: string[];
};
