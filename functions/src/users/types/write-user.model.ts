import { FieldValue } from "firebase-admin/firestore";
import { UserAvatar } from "../../shared/types/author-snapshot";

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
