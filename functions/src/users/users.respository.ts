import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { User } from "./types/users.entity";
import { WriteUserModel } from "./types/write-user.model";
import { BaseRepository } from "../common/firebase/base.repository";
import { Firestore } from "firebase-admin/firestore";
import { COLLECTIONS, FIRESTORE } from "../common/firebase/firebase.constants";

@Injectable()
export class UsersRepository extends BaseRepository<User, WriteUserModel> {
  constructor(
    @Inject(FIRESTORE)
    firestore: Firestore,
  ) {
    super(firestore, COLLECTIONS.USERS);
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

  async assertUsernameAvailable(
    userId: string,
    username: string,
    tx: FirebaseFirestore.Transaction,
  ) {
    const usernameQuery = this.firestore
      .collection("users")
      .where("username", "==", username)
      .limit(1);

    const snap = await tx.get(usernameQuery);

    if (!snap.empty) {
      const doc = snap.docs[0];

      if (doc.id !== userId) {
        throw new BadRequestException("Username already taken");
      }
    }
  }
}
