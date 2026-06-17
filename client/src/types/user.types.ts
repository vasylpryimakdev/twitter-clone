export type PostUser = {
  id: string;
  name: string;
  username: string;
  avatar: string;
};

export type UserProfile = {
  id: string;
  name: string;
  username: string;
  avatar: string;

  bio?: string;
  verified: boolean;

  followersCount: number;
  followingCount: number;

  createdAt: string;
};
