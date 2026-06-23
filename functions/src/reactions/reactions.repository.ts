import { Inject, Injectable } from "@nestjs/common";
import { Firestore, Transaction } from "firebase-admin/firestore";
import { BaseRepository } from "../common/firebase/base.repository";
import { COLLECTIONS, FIRESTORE } from "../common/firebase/firebase.constants";
import { Reaction, ReactionType } from "./reaction.entity";
import { mapDoc } from "../common/firebase/mappers/firestore.mapper";

@Injectable()
export class ReactionsRepository extends BaseRepository<
  Reaction,
  { postId: string; userId: string; type: ReactionType }
> {
  constructor(
    @Inject(FIRESTORE)
    firestore: Firestore,
  ) {
    super(firestore, COLLECTIONS.REACTIONS);
  }

  private getRefByKeys(postId: string, userId: string) {
    return this.getRef(`${postId}_${userId}`);
  }

  async get(postId: string, userId: string, tx?: Transaction) {
    const ref = this.getRefByKeys(postId, userId);

    const snap = tx ? await tx.get(ref) : await ref.get();

    return snap.exists ? mapDoc<Reaction>(snap) : null;
  }

  setReaction(
    postId: string,
    userId: string,
    type: ReactionType,
    tx: Transaction,
  ) {
    const ref = this.getRefByKeys(postId, userId);

    const data = {
      id: `${postId}_${userId}`,
      postId,
      userId,
      type,
    };

    tx.set(ref, data);
  }

  async findByUser(userId: string) {
    const snapshot = await this.query().where("userId", "==", userId).get();

    return snapshot.docs.map((d) => mapDoc<Reaction>(d));
  }

  async findByPost(postId: string, limit = 100, cursor?: string) {
    let query = this.query().where("postId", "==", postId).limit(limit);

    if (cursor) {
      const cursorDoc = await this.getRef(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snapshot = await query.get();

    return {
      data: snapshot.docs.map((d) => mapDoc<Reaction>(d)),
      lastCursor:
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1].id
          : null,
    };
  }

  async findByUserAndPostIds(
    userId: string,
    postIds: string[],
  ): Promise<Reaction[]> {
    if (!postIds.length) return [];

    const chunks: string[][] = [];

    for (let i = 0; i < postIds.length; i += 10) {
      chunks.push(postIds.slice(i, i + 10));
    }

    const snaps = await Promise.all(
      chunks.map((chunk) =>
        this.collection
          .where("userId", "==", userId)
          .where("postId", "in", chunk)
          .get(),
      ),
    );

    return snaps.flatMap((snap) =>
      snap.docs.map((doc) => mapDoc<Reaction>(doc)),
    );
  }

  deleteReaction(postId: string, userId: string, tx: Transaction) {
    const ref = this.getRefByKeys(postId, userId);
    tx.delete(ref);
  }
}
