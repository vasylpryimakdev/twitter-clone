import { Timestamp } from "firebase-admin/firestore";

export const ReactionTypes = {
  LIKE: "like",
  DISLIKE: "dislike",
} as const;

export type ReactionType = (typeof ReactionTypes)[keyof typeof ReactionTypes];

export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  type: ReactionType;
  createdAt: Timestamp;
}
