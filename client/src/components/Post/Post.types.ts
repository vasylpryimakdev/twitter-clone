export type PostUser = {
  id: string;
  name: string;
  username: string;
  avatar: string;
};

export type Post = {
  id: string;
  user: PostUser;
  title: string;
  text: string;
  image?: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
};
