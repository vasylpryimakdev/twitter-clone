import { ReactionType } from "../entities/reaction.entity";

export type CreateReactionInput = {
  id: string;
  postId: string;
  userId: string;
  type: ReactionType;
};
