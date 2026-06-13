import { Timestamp } from "firebase-admin/firestore";

export type ReactionType = "like" | "dislike";

export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  type: ReactionType;
  createdAt: Timestamp;
}
