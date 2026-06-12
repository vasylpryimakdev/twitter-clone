import { Injectable } from "@nestjs/common";
import { firebaseAdmin } from "../config/firebase.config";
import { Post } from "./post.entity";

@Injectable()
export class PostsRepository {
  private postsCollection = firebaseAdmin.firestore().collection("posts");

  async create(data: Omit<Post, "id">): Promise<Post> {
    const docRef = this.postsCollection.doc();

    await docRef.set(data);

    const snapshot = await docRef.get();

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Post;
  }

  async findById(id: string): Promise<Post | null> {
    const doc = await this.postsCollection.doc(id).get();

    if (!doc.exists) return null;

    return {
      id: doc.id,
      ...doc.data(),
    } as Post;
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    const docRef = this.postsCollection.doc(id);

    await docRef.update({
      ...data,
      updatedAt: new Date(),
    });

    const updated = await docRef.get();

    return {
      id: updated.id,
      ...updated.data(),
    } as Post;
  }

  async delete(id: string): Promise<void> {
    await this.postsCollection.doc(id).delete();
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
