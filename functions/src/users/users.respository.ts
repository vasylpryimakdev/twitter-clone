import { Injectable } from "@nestjs/common";
import { User } from "./users.entity";
import { firebaseAdmin } from "../config/firebase.config";

@Injectable()
export class UserRepository {
  private usersCollection = firebaseAdmin.firestore().collection("users");

  async findOne(
    id: string,
    transaction?: FirebaseFirestore.Transaction,
  ): Promise<User | null> {
    const doc = transaction
      ? await transaction.get(this.usersCollection.doc(id))
      : await this.usersCollection.doc(id).get();
    return this.mapDoc(doc);
  }

  async create(
    user: User,
    transaction?: FirebaseFirestore.Transaction | FirebaseFirestore.WriteBatch,
  ): Promise<void> {
    const { id, ...data } = user;
    const docRef = this.usersCollection.doc(id);
    if (transaction) {
      (transaction as any).set(docRef, data);
    } else {
      await docRef.set(data);
    }
  }

  async updateUser(
    id: string,
    data: Partial<User>,
    transaction?: FirebaseFirestore.Transaction | FirebaseFirestore.WriteBatch,
  ): Promise<void> {
    const docRef = this.usersCollection.doc(id);
    if (transaction) {
      (transaction as any).update(docRef, data);
    } else {
      await docRef.update(data);
    }
  }

  async delete(
    id: string,
    transaction?: FirebaseFirestore.Transaction | FirebaseFirestore.WriteBatch,
  ): Promise<void> {
    const docRef = this.usersCollection.doc(id);
    if (transaction) {
      (transaction as any).delete(docRef);
    } else {
      await docRef.delete();
    }
  }

  private mapDoc(doc: FirebaseFirestore.DocumentSnapshot): User | null {
    if (!doc.exists) return null;
    const data = doc.data();
    if (!data) return null;

    return {
      id: doc.id,
      ...data,
      createdAt:
        data.createdAt && typeof data.createdAt.toDate === "function"
          ? data.createdAt.toDate()
          : new Date(data.createdAt),
    } as User;
  }
}
