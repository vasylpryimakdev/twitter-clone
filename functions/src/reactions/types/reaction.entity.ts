import { Timestamp } from "firebase-admin/firestore";

export enum ReactionType {
  LIKE = "like",
  DISLIKE = "dislike",
}
export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  type: ReactionType;
  createdAt: Timestamp;
}
