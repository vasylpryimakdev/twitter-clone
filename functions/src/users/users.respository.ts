import { Injectable } from "@nestjs/common";
import { User } from "./users.entity";
import { firebaseAdmin } from "../config/firebase.config";
import { mapTimestamp } from "../common/utils/firestore-date.util";

@Injectable()
export class UsersRepository {
  private usersCollection = firebaseAdmin.firestore().collection("users");

  async findOne(id: string): Promise<User | null> {
    const doc = await this.usersCollection.doc(id).get();

    return this.mapDoc(doc);
  }

  async create(user: User): Promise<User> {
    const { uid, ...data } = user;
    const docRef = this.usersCollection.doc(uid);
    await docRef.set(data);

    const snapshot = await docRef.get();

    return this.mapDoc(snapshot) as User;
  }

  async update(id: string, data: Partial<Omit<User, "uid" | "createdAt">>): Promise<User | null> {
    const docRef = this.usersCollection.doc(id);

    await docRef.update({
      ...data,
      updatedAt: new Date(),
    });

    const updatedDoc = await docRef.get();

    return this.mapDoc(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    const docRef = this.usersCollection.doc(id);
    await docRef.delete();
  }

  private mapDoc(doc: FirebaseFirestore.DocumentSnapshot): User | null {
    if (!doc.exists) return null;

    const data = doc.data();
    if (!data) return null;

    return {
      uid: doc.id,
      ...data,
      createdAt: mapTimestamp(data.createdAt),
      updatedAt: mapTimestamp(data.updatedAt),
    } as User;
  }
}
