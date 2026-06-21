import { Timestamp } from "firebase-admin/firestore";
import { PostImageDto } from "../dto/post-dto";
import { UserAvatar } from "../../shared/types/author-snapshot";

export interface PostAuthorSnapshot {
  id: string;
  name: string;
  surname: string;
  username: string;
  avatar?: UserAvatar;
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

  userReaction!: "like" | "dislike" | null;
}
