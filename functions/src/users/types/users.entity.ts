import { Timestamp } from "firebase-admin/firestore";

export class User {
  id!: string;
  email!: string;
  name!: string;
  surname!: string;
  avatar?: string;
  createdAt!: Timestamp;
  updatedAt!: Timestamp;
}
