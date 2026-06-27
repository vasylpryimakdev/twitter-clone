export type PostDeletionPlan = {
  postId: string;

  cascadeCommentIds: string[];
  parentImpact: Map<string, { repliesDelta: number }>;

  reactionIds: string[];

  postImpact: Map<string, PostImpact>;
};

export interface PostImpact {
  commentsDelta: number;
  likesDelta: number;
  dislikesDelta: number;
  scoreDelta: number;
}

export type PostUpdate = {
  postId: string;
  commentsDelta: number;
  likesDelta: number;
  dislikesDelta: number;
  scoreDelta: number;
};
