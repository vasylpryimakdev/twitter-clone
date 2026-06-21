export type UpdateUserDto = {
  name?: string;
  surname?: string;
  username?: string;
  avatar?: UserAvatar | string | null;
};

export type Author = {
  id: string;
  name: string;
  surname: string;
  username: string;
  avatar: UserAvatar;
};

export type UserAvatar = {
  url: string;
  path?: string;
  type: "google" | "upload";
} | null;

export type UserProfile = {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  emailVerified: boolean;
  avatar: UserAvatar;

  createdAt: string;
};
