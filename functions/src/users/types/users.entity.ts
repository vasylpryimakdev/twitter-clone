import { Timestamp } from "firebase-admin/firestore";

export type UserAvatar = {
  url: string;
  path?: string;
  type: "google" | "upload";
} | null;

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
