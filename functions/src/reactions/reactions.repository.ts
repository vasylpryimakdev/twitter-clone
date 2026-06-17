import { Firestore, Transaction } from "firebase-admin/firestore";
import { Reaction, ReactionType } from "./reaction.entity";
import { FIRESTORE } from "../common/firestore/firestore.provider";
import { Inject, Injectable } from "@nestjs/common";
import { mapDoc } from "../common/firestore/firestore.mapper";

@Injectable()
export class ReactionsRepository {
  constructor(
    @Inject(FIRESTORE)
    private readonly firestore: Firestore,
  ) {}

  getRef(postId: string, userId: string) {
    return this.firestore.collection("reactions").doc(`${postId}_${userId}`);
  }

  async get(
    postId: string,
    userId: string,
    tx?: Transaction,
  ): Promise<Reaction | null> {
    const ref = this.getRef(postId, userId);

    const snap = tx ? await tx.get(ref) : await ref.get();

    return snap.exists ? mapDoc<Reaction>(snap) : null;
  }

  set(postId: string, userId: string, type: ReactionType, tx: Transaction) {
    tx.set(this.getRef(postId, userId), { postId, userId, type });
  }

  delete(postId: string, userId: string, tx: Transaction) {
    tx.delete(this.getRef(postId, userId));
  }

  async findByUser(userId: string) {
    const snap = await this.firestore
      .collection("reactions")
      .where("userId", "==", userId)
      .get();

    return snap.docs.map((d) => mapDoc<Reaction>(d));
  }

  async findByPost(postId: string, limit = 100, cursor?: string) {
    let query = this.firestore
      .collection("reactions")
      .where("postId", "==", postId)
      .limit(limit);

    if (cursor) {
      const cursorDoc = await this.firestore
        .collection("reactions")
        .doc(cursor)
        .get();

      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snapshot = await query.get();
    const lastDoc =
      snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null;

    return {
      data: snapshot.docs.map((d) => mapDoc<Reaction>(d)),
      lastCursor: lastDoc,
    };
  }
}
