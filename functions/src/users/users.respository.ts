import { Inject, Injectable } from "@nestjs/common";
import { User } from "./types/users.entity";
import { WriteUserModel } from "./types/write-user.model";
import { BaseRepository } from "../common/firestore/base.repository";
import { FIRESTORE } from "../common/firestore/firestore.provider";
import { Firestore } from "firebase-admin/firestore";

@Injectable()
export class UsersRepository extends BaseRepository<User, WriteUserModel> {
  constructor(
    @Inject(FIRESTORE)
    firestore: Firestore,
  ) {
    super(firestore, "users");
  }

  async findByUsername(username: string) {
    const snapshot = await this.firestore
      .collection("users")
      .where("username", "==", username)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];

    return {
      id: doc.id,
      ...doc.data(),
    };
  }
}
