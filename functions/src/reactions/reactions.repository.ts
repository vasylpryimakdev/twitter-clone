import { Injectable } from "@nestjs/common";
import { firebaseAdmin } from "../config/firebase.config";
import { CreateReactionInput } from "./types/create-reaction-input.type";
import { Reaction } from "./types/reaction.entity";
import { FieldValue } from "firebase-admin/firestore";
import mapFirestoreError from "../common/firestore/firestore-error.mapper";

@Injectable()
export class ReactionsRepository {
  private collection = firebaseAdmin.firestore().collection("reactions");

  async findById(id: string): Promise<Reaction | null> {
    try {
      const snap = await this.collection.doc(id).get();

      if (!snap.exists) return null;

      return snap.data() as Reaction;
    } catch (err) {
      mapFirestoreError(err);
    }
  }

  async create(data: CreateReactionInput): Promise<void> {
    try {
      await this.collection.doc(data.id).set({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (err) {
      mapFirestoreError(err);
    }
  }

  async update(id: string, data: Partial<Reaction>): Promise<void> {
    try {
      await this.collection.doc(id).update({
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (err) {
      mapFirestoreError(err);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.collection.doc(id).delete();
    } catch (err) {
      mapFirestoreError(err);
    }
  }
}
