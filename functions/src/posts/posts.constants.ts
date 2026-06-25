import { ReactionType } from "../reactions/reaction.entity";

export const POST_SCORE_WEIGHTS = {
  LIKE: 2,
  COMMENT: 3,
  REPLY: 3,
};

export const REACTION_SCORE_WEIGHT: Record<ReactionType, number> = {
  like: 1,
  dislike: -1,
} as const;
