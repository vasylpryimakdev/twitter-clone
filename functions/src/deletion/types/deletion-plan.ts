export type DeletionPlan = {
  postIds: string[];
  commentIds: string[];
  reactionIds: string[];

  counterDeltas: Map<
    string,
    {
      comments?: number;
      likes?: number;
      dislikes?: number;
      score?: number;
      replies?: number;
    }
  >;
};
