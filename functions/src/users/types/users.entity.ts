import { Timestamp } from "firebase-admin/firestore";
import { UserAvatar } from "../../shared/types/author-snapshot";

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
