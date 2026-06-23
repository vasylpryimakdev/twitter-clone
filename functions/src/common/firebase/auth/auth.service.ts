import { Inject, Injectable } from "@nestjs/common";
import { FIREBASE_AUTH } from "../firebase.constants";
import { Auth } from "firebase-admin/auth";

@Injectable()
export class AuthService {
  constructor(
    @Inject(FIREBASE_AUTH)
    private readonly auth: Auth,
  ) {}

  verifyIdToken(token: string) {
    return this.auth.verifyIdToken(token);
  }

  getUser(uid: string) {
    return this.auth.getUser(uid);
  }

  createUser(data: { email: string; password?: string; displayName?: string }) {
    return this.auth.createUser(data);
  }

  updateUser(uid: string, data: any) {
    return this.auth.updateUser(uid, data);
  }

  deleteUser(uid: string) {
    return this.auth.deleteUser(uid);
  }
}
