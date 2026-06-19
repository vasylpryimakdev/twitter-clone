import { FieldValue } from "firebase-admin/firestore";

export interface PostAuthorSnapshot {
  id: string;
  name: string;
  surname: string;
  username: string;
  avatar?: string;
}

export type WritePostModel = {
  id: string;
  authorId: string;

  author: PostAuthorSnapshot;

  title: string;
  text: string;

  imageUrl?: string | null;

  likesCount: number;
  dislikesCount: number;
  commentsCount: number;

  createdAt: FieldValue;
  updatedAt: FieldValue;
};
