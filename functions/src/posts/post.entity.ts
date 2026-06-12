export class Post {
  id!: string;

  authorId!: string;

  title!: string;
  text!: string;

  photoUrl?: string | null;

  createdAt!: Date;
  updatedAt!: Date;

  likesCount!: number;
  dislikesCount!: number;
  commentsCount!: number;
}
