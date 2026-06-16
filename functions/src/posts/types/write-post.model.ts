import { FieldValue } from "firebase-admin/firestore";

export type WritePostModel = {
  id: string;
  authorId: string;

  title: string;
  text: string;

  imageUrl?: string | null;

  likesCount: number;
  dislikesCount: number;
  commentsCount: number;

  createdAt: FieldValue;
  updatedAt: FieldValue;
};
