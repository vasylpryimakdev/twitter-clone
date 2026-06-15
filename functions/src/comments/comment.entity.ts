import { Timestamp } from "firebase-admin/firestore";

export type Comment = {
  id: string;

  postId: string;
  userId: string;

  parentId: string | null;

  text: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
};
