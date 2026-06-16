import { FieldValue } from "firebase-admin/firestore";

export type CreateComment = {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  text: string;
  repliesCount: number;
  createdAt: FieldValue;
  updatedAt: FieldValue;
};
