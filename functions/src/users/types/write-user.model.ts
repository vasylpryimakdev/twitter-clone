import { FieldValue } from "firebase-admin/firestore";

export class WriteUserModel {
  id!: string;
  email!: string;
  name!: string;
  surname!: string;
  avatar?: string;
  createdAt!: FieldValue;
  updatedAt!: FieldValue;
}
