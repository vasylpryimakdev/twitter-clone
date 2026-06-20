import { Timestamp } from "firebase-admin/firestore";
import { PostImageDto } from "../dto/post-dto";

export interface PostAuthorSnapshot {
  id: string;
  name: string;
  surname: string;
  username: string;
  avatar?: string;
}

export class Post {
  id!: string;
  authorId!: string;
  author!: PostAuthorSnapshot;

  title!: string;
  text!: string;

  image!: PostImageDto | null;

  createdAt!: Timestamp;
  updatedAt!: Timestamp;

  likesCount!: number;
  dislikesCount!: number;
  commentsCount!: number;
}
