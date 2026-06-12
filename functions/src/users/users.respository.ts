import { Injectable } from "@nestjs/common";
import { User } from "./users.entity";
import { firebaseAdmin } from "../config/firebase.config";
import { mapDoc } from "../common/utils/firestore.mapper";

@Injectable()
export class UsersRepository {
  private usersCollection = firebaseAdmin.firestore().collection("users");

  async findOne(id: string): Promise<User | null> {
    const doc = await this.usersCollection.doc(id).get();

    return mapDoc(doc);
  }

  async create(user: User): Promise<User> {
    const { uid, ...data } = user;
    const docRef = this.usersCollection.doc(uid);

    await docRef.set(data);

    return user;
  }

  async update(
    id: string,
    data: Partial<Omit<User, "uid" | "createdAt">>,
  ): Promise<User | null> {
    const docRef = this.usersCollection.doc(id);

    await docRef.update({
      ...data,
      updatedAt: new Date(),
    });

    const updatedDoc = await docRef.get();

    return mapDoc(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    const docRef = this.usersCollection.doc(id);
    await docRef.delete();
  }
}
