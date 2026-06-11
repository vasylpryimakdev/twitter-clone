import { Injectable } from "@nestjs/common";
import { firebaseAdmin } from "../config/firebase.config";

@Injectable()
export class AuthService {
  async verifyToken(token: string) {
    return firebaseAdmin.auth().verifyIdToken(token);
  }

  async getUser(uid: string) {
    return firebaseAdmin.auth().getUser(uid);
  }

  async deleteUser(uid: string) {
    return firebaseAdmin.auth().deleteUser(uid);
  }
}
