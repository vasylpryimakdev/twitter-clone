import { Inject, Injectable } from "@nestjs/common";
import { Firestore } from "firebase-admin/firestore";
import { FIRESTORE } from "../common/firestore/firestore.provider";

@Injectable()
export class ReactionsRepository {
  constructor(
    @Inject(FIRESTORE)
    private readonly firestore: Firestore,
  ) {}

  getRef(targetId: string, userId: string) {
    return this.firestore.collection("reactions").doc(`${targetId}_${userId}`);
  }
}
