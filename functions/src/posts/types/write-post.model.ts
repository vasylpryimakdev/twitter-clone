import { FieldValue } from "firebase-admin/firestore";
import { PostImageDto } from "../dto/post-dto";
import { PostAuthorSnapshot } from "./post.entity";

export type WritePostModel = {
  id: string;
  authorId: string;

  author: PostAuthorSnapshot;

  title: string;
  text: string;
  searchField: string;

  image: PostImageDto | null;

  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  score: number;

  createdAt: FieldValue;
  updatedAt: FieldValue;
};
