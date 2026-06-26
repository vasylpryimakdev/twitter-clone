export type ReactionDeletionPlan = {
  reactionIds: string[];

  postImpact: Map<
    string,
    {
      likesDelta: number;
      dislikesDelta: number;
      scoreDelta: number;
    }
  >;
};
