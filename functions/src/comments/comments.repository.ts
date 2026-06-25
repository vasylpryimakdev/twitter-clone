import { Injectable, Inject } from "@nestjs/common";
import { Firestore, FieldValue, Transaction } from "firebase-admin/firestore";

import { Comment } from "./comment.entity";
import { BaseRepository } from "../common/firebase/base.repository";
import { WriteComment } from "./types/write-comment.model";
import { CommentCounterField } from "./types/comment-counter-field";
import { COLLECTIONS, FIRESTORE } from "../common/firebase/firebase.constants";
import { mapDoc } from "../common/firebase/mappers/firestore.mapper";

@Injectable()
export class CommentsRepository extends BaseRepository<Comment, WriteComment> {
  constructor(
    @Inject(FIRESTORE)
    firestore: Firestore,
  ) {
    super(firestore, COLLECTIONS.COMMENTS);
  }

  async findAllByPost(postId: string) {
    const snapshot = await this.collection.where("postId", "==", postId).get();

    return snapshot.docs.map((doc) => mapDoc<Comment>(doc));
  }

  async findTopLevelByPost(postId: string, limit = 20, cursor?: string) {
    let query = this.collection
      .where("postId", "==", postId)
      .where("parentId", "==", null)
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (cursor) {
      const cursorDoc = await this.collection.doc(cursor).get();

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
      data: snapshot.docs.map((doc) => mapDoc<Comment>(doc)),
      nextCursor: lastDoc,
    };
  }

  async findByAuthor(authorId: string): Promise<Comment[]> {
    const snap = await this.firestore
      .collection("comments")
      .where("authorId", "==", authorId)
      .get();

    return snap.docs.map((doc) => mapDoc<Comment>(doc));
  }

  async findReplies(parentId: string, limit = 20, cursor?: string) {
    let query = this.collection
      .where("parentId", "==", parentId)
      .orderBy("createdAt", "asc")
      .limit(limit);

    if (cursor) {
      const cursorSnap = await this.collection.doc(cursor).get();
      if (cursorSnap.exists) {
        query = query.startAfter(cursorSnap);
      }
    }

    const snapshot = await query.get();
    const lastDoc =
      snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null;

    return {
      data: snapshot.docs.map((doc) => mapDoc<Comment>(doc)),
      nextCursor: lastDoc,
    };
  }

  async countReplies(parentId: string) {
    const query = this.collection.where("parentId", "==", parentId);

    return this.countDocs(query);
  }

  async deleteRepliesInBatches(parentId: string) {
    let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | null = null;

    while (true) {
      let query = this.collection
        .where("parentId", "==", parentId)
        .orderBy("createdAt", "asc")
        .limit(500);

      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const snapshot = await query.get();

      if (snapshot.empty) break;

      const batch = this.firestore.batch();

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      lastDoc = snapshot.docs[snapshot.docs.length - 1];

      if (snapshot.size < 500) break;
    }
  }

  async adjustCounter(
    id: string,
    field: CommentCounterField,
    delta: number,
    tx?: Transaction,
  ): Promise<void> {
    const ref = this.getRef(id);

    const update = {
      [field]: FieldValue.increment(delta),
    };

    if (tx) {
      tx.update(ref, update);
      return;
    }

    await ref.update(update);
  }
}
