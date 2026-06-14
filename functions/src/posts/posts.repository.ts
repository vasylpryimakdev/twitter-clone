import { Injectable, NotFoundException } from "@nestjs/common";
import { firebaseAdmin } from "../config/firebase.config";
import { Post } from "./types/post.entity";
import { CreatePostInput } from "./types/create-post-input.type";
import { FieldValue } from "firebase-admin/firestore";
import { mapDoc } from "../common/firestore/firestore.mapper";
import mapFirestoreError from "../common/firestore/firestore-error.mapper";

@Injectable()
export class PostsRepository {
  private postsCollection = firebaseAdmin.firestore().collection("posts");

  async create(post: CreatePostInput): Promise<Post> {
    const docRef = this.postsCollection.doc();

    try {
      await docRef.create({
        ...post,
        likesCount: 0,
        dislikesCount: 0,
        commentsCount: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const snapshot = await docRef.get();

      return mapDoc<Post>(snapshot);
    } catch (err) {
      mapFirestoreError(err);
    }
  }

  async findById(id: string): Promise<Post> {
    try {
      const doc = await this.postsCollection.doc(id).get();

      if (!doc.exists) {
        throw new NotFoundException("Post not found");
      }

      return mapDoc<Post>(doc);
    } catch (err) {
      mapFirestoreError(err);
    }
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    const docRef = this.postsCollection.doc(id);

    try {
      await docRef.update({
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const updated = await docRef.get();

      return mapDoc<Post>(updated);
    } catch (err) {
      mapFirestoreError(err);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.postsCollection.doc(id).delete();
    } catch (err) {
      mapFirestoreError(err);
    }
  }

  async findByUser(userId: string, limit: number, cursor?: string) {
    let query = this.postsCollection
      .where("authorId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (cursor) {
      const cursorDoc = await this.postsCollection.doc(cursor).get();
      query = query.startAfter(cursorDoc);
    }

    const snapshot = await query.get();

    return {
      docs: snapshot.docs,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] ?? null,
    };
  }

  async findFeed(limit: number, cursor?: string) {
    let query = this.postsCollection.orderBy("createdAt", "desc").limit(limit);

    if (cursor) {
      const cursorDoc = await this.postsCollection.doc(cursor).get();
      query = query.startAfter(cursorDoc);
    }

    const snapshot = await query.get();

    return {
      docs: snapshot.docs,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] ?? null,
    };
  }
}
