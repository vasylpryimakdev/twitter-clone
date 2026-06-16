import { Injectable, Inject } from "@nestjs/common";
import { Firestore, FieldValue, Transaction } from "firebase-admin/firestore";

import { FIRESTORE } from "../common/firestore/firestore.provider";
import { CommentInput } from "./types/comment-input";
import { mapDoc } from "../common/firestore/firestore.mapper";
import { Comment } from "./comment.entity";
import { BaseRepository } from "../common/firestore/base.repository";
import { CreateComment } from "./types/create-comment.type";

@Injectable()
export class CommentsRepository extends BaseRepository<Comment, CreateComment> {
  constructor(
    @Inject(FIRESTORE)
    firestore: Firestore,
  ) {
    super(firestore, "comments");
  }

  async findByPost(postId: string, limit = 20, cursor?: string) {
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

    return {
      data: snapshot.docs.map((doc) => doc.data() as CommentInput),
      lastCursor: snapshot.docs.length
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null,
    };
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

    return {
      data: snapshot.docs.map((doc) => mapDoc(doc)),
      lastCursor: snapshot.docs.length
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null,
    };
  }

  async incrementRepliesCount(tx: Transaction, commentId: string) {
    const ref = this.getRef(commentId);

    tx.update(ref, {
      repliesCount: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
}
