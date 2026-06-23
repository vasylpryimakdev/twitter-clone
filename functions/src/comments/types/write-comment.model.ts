import { FieldValue } from "firebase-admin/firestore";
import { AuthorSnapshot } from "../../users/types/users.entity";

export type WriteComment = {
  id: string;
  postId: string;
  authorId: string;
  author: AuthorSnapshot;

  parentId: string | null;

  text: string;

  repliesCount?: number;

  createdAt: FieldValue;
  updatedAt: FieldValue;
};
