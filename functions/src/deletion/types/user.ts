import { CommentDeletionPlan } from "./comment";
import { PostDeletionPlan } from "./post";
import { PostImpact } from "./post";

export type UserDeletionPlan = {
  postIds: string[];
  ownedPostPlans: PostDeletionPlan[];
  reactionIds: string[];
  userCommentPlan: CommentDeletionPlan;
  postImpact: Map<string, PostImpact>;
};
