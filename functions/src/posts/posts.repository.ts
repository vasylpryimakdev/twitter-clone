import { Inject, Injectable } from "@nestjs/common";
import { Post } from "./types/post.entity";
import { FieldValue, Firestore, Transaction } from "firebase-admin/firestore";

import { BaseRepository } from "../common/firestore/base.repository";
import { FIRESTORE } from "../common/firestore/firestore.provider";
import { WritePostModel } from "./types/write-post.model";
import { PostCounterField } from "./types/post-counter-field";
import { mapDoc } from "../common/firestore/firestore.mapper";

@Injectable()
export class PostsRepository extends BaseRepository<Post, WritePostModel> {
  constructor(
    @Inject(FIRESTORE)
    firestore: Firestore,
  ) {
    super(firestore, "posts");
  }

  async findByUser(userId: string, limit: number, cursor?: string) {
    let query = this.firestore
      .collection("posts")
      .where("authorId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (cursor) {
      const cursorDoc = await this.firestore
        .collection("posts")
        .doc(cursor)
        .get();

      query = query.startAfter(cursorDoc);
    }

    const snapshot = await query.get();
    const lastDoc =
      snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null;

    return {
      data: snapshot.docs.map((doc) => mapDoc<Post>(doc)),
      lastDoc: lastDoc,
    };
  }

  async findFeed(limit: number, cursor?: string) {
    let query = this.firestore
      .collection("posts")
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (cursor) {
      const cursorDoc = await this.firestore
        .collection("posts")
        .doc(cursor)
        .get();
      query = query.startAfter(cursorDoc);
    }

    const snapshot = await query.get();

    return {
      docs: snapshot.docs,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] ?? null,
    };
  }

  async adjustCounter(
    id: string,
    field: PostCounterField,
    delta: number,
    tx?: Transaction,
  ): Promise<void> {
    const ref = this.getRef(id);

    const updateData = {
      [field]: FieldValue.increment(delta),
    };

    if (tx) {
      tx.update(ref, updateData);
      return;
    }

    await ref.update(updateData);
  }
}
