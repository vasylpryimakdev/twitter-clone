export type PostUser = {
  id: string;
  name: string;
  username: string;
  avatar: string;
};

export type UserProfile = {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  emailVerified: boolean;
  avatar: string;

  followersCount: number;
  followingCount: number;

  createdAt: string;
};
