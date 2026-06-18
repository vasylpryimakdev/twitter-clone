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
  avatar: string;
  emailVerified: boolean;

  followersCount: number;
  followingCount: number;

  createdAt: string;
};
