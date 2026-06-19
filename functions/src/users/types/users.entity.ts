import { Timestamp } from "firebase-admin/firestore";

export class User {
  id!: string;
  email!: string;

  name!: string;
  surname!: string;

  username!: string;

  avatar!: string | null;

  createdAt!: Timestamp;
  updatedAt!: Timestamp;
}
