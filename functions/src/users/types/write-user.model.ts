import { FieldValue } from "firebase-admin/firestore";

export class WriteUserModel {
  id!: string;
  email!: string;
  emailVerified!: boolean;
  name!: string;
  surname!: string;
  username!: string;
  avatar?: string;
  createdAt!: FieldValue;
  updatedAt!: FieldValue;
}
