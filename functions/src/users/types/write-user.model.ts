import { FieldValue } from "firebase-admin/firestore";
import { UserAvatar } from "./users.entity";

export class WriteUserModel {
  id!: string;
  email!: string;
  name!: string;
  surname!: string;
  username!: string;
  avatar?: UserAvatar;
  createdAt!: FieldValue;
  updatedAt!: FieldValue;
}
