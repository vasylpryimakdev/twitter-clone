import { Timestamp } from "firebase-admin/firestore";
export class User {
  id!: string;
  email!: string;

  name!: string;
  surname!: string;
  username!: string;

  avatar!: UserAvatar;

  createdAt!: Timestamp;
  updatedAt!: Timestamp;
}

export interface AuthorSnapshot {
  id: string;
  name: string;
  surname: string;
  username: string;
  avatar?: UserAvatar;
}

export type UserAvatar = {
  url: string;
  path?: string;
  type: "google" | "upload";
} | null;
