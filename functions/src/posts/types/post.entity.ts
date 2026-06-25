import { UserAvatar } from "../../users/types/users.entity";
import { PostImageDto } from "../dto/post-dto";

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

  createdAt!: Date;
  updatedAt!: Date;

  likesCount!: number;
  dislikesCount!: number;
  commentsCount!: number;
  score!: number;

  userReaction!: "like" | "dislike" | null;
}
