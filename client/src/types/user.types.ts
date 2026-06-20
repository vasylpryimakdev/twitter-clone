export type PostUser = {
  id: string;
  name: string;
  surname: string;
  username: string;
  avatar: Avatar;
};

export type Avatar = {
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
  avatar: Avatar;

  createdAt: string;
};
