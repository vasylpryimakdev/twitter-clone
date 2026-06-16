import { Timestamp } from "firebase-admin/firestore";

export class Post {
  id!: string;
  authorId!: string;

  title!: string;
  text!: string;

  imageUrl?: string | null;

  createdAt!: Timestamp;
  updatedAt!: Timestamp;

  likesCount!: number;
  dislikesCount!: number;
  commentsCount!: number;
}
