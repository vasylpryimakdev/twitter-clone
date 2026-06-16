import { Timestamp } from "firebase-admin/firestore";

export type Comment = {
  id: string;

  postId: string;
  authorId: string;

  parentId: string | null;

  text: string;

  repliesCount: number;

  createdAt: Timestamp;
  updatedAt: Timestamp;
};
