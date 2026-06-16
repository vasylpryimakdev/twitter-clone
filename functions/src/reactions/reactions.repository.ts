import { Inject, Injectable } from "@nestjs/common";
import { Firestore, Transaction } from "firebase-admin/firestore";
import { FIRESTORE } from "../common/firestore/firestore.provider";
import { ReactionType } from "./types/reaction.entity";

@Injectable()
export class ReactionsRepository {
  constructor(
    @Inject(FIRESTORE)
    private readonly firestore: Firestore,
  ) {}

  getRef(targetId: string, userId: string) {
    return this.firestore.collection("reactions").doc(`${targetId}_${userId}`);
  }

  async get(postId: string, userId: string, tx: Transaction) {
    const snap = await tx.get(this.getRef(postId, userId));

    return snap.exists ? (snap.data() as { type: ReactionType }) : null;
  }

  set(postId: string, userId: string, type: ReactionType, tx: Transaction) {
    tx.set(this.getRef(postId, userId), { postId, userId, type });
  }

  delete(postId: string, userId: string, tx: Transaction) {
    tx.delete(this.getRef(postId, userId));
  }
}
