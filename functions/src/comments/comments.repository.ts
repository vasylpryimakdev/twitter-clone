import { Injectable, Inject } from "@nestjs/common";
import { Firestore, FieldValue } from "firebase-admin/firestore";

import { FIRESTORE } from "../common/firestore/firestore.provider";
import { CommentInput } from "./types/comment-input";

@Injectable()
export class CommentsRepository {
  private readonly collection;

  constructor(
    @Inject(FIRESTORE)
    private readonly firestore: Firestore,
  ) {
    this.collection = this.firestore.collection("comments");
  }

  createId(): string {
    return this.collection.doc().id;
  }

  async findById(id: string): Promise<CommentInput | null> {
    const snap = await this.collection.doc(id).get();

    if (!snap.exists) return null;

    return snap.data() as CommentInput;
  }

  async create(comment: CommentInput): Promise<void> {
    await this.collection.doc(comment.id).set({
      ...comment,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  async update(id: string, data: Partial<CommentInput>): Promise<void> {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  async findByPost(postId: string, limit = 20, cursor?: string) {
    let query = this.collection
      .where("postId", "==", postId)
      .where("parentId", "==", null)
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (cursor) {
      const cursorSnap = await this.collection.doc(cursor).get();
      if (cursorSnap.exists) {
        query = query.startAfter(cursorSnap);
      }
    }

    const snapshot = await query.get();

    const comments = snapshot.docs.map((doc) => doc.data() as CommentInput);

    return {
      data: comments,
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
      data: snapshot.docs.map((doc) => doc.data() as CommentInput),
      lastCursor: snapshot.docs.length
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null,
    };
  }
}
