import { Injectable, NotFoundException } from "@nestjs/common";
import { FieldValue } from "firebase-admin/firestore";
import { User } from "./types/users.entity";
import { firebaseAdmin } from "../config/firebase.config";
import mapFirestoreError from "../common/firestore/firestore-error.mapper";
import { mapDoc } from "../common/firestore/firestore.mapper";
import { CreateUserInput } from "./types/create-user-input.type";

@Injectable()
export class UsersRepository {
  private usersCollection = firebaseAdmin.firestore().collection("users");

  async findOne(id: string): Promise<User> {
    const doc = await this.usersCollection.doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException("User not found");
    }

    return mapDoc(doc);
  }

  async create(id: string, user: CreateUserInput): Promise<User> {
    const docRef = this.usersCollection.doc(id);

    try {
      await docRef.create({
        ...user,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const snapshot = await docRef.get();

      return mapDoc<User>(snapshot);
    } catch (err: any) {
      mapFirestoreError(err);
    }
  }

  async update(
    id: string,
    data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
  ): Promise<User> {
    const docRef = this.usersCollection.doc(id);

    try {
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new NotFoundException("User not found");
      }

      await docRef.update({
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const updatedDoc = await docRef.get();

      return mapDoc<User>(updatedDoc);
    } catch (err) {
      mapFirestoreError(err);
    }
  }

  async delete(id: string): Promise<void> {
    const docRef = this.usersCollection.doc(id);
    try {
      await docRef.delete();
    } catch (err) {
      mapFirestoreError(err);
    }
  }
}
