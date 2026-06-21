import { FieldValue } from "firebase-admin/firestore";
import { AuthorSnapshot } from "../../shared/types/author-snapshot";

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
