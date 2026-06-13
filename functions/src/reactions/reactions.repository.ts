import { Injectable } from "@nestjs/common";
import { ReactionType } from "./reactions.service";
import { firebaseAdmin } from "../config/firebase.config";

export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  type: ReactionType;
}

@Injectable()
export class ReactionsRepository {
  private collection = firebaseAdmin.firestore().collection("reactions");

  async findByPostAndUser(
    postId: string,
    userId: string,
  ): Promise<Reaction | null> {
    const id = `${postId}_${userId}`;
    const snap = await this.collection.doc(id).get();

    if (!snap.exists) return null;

    return snap.data() as Reaction;
  }

  async create(data: Reaction): Promise<void> {
    await this.collection.doc(data.id).set({
      ...data,
      createdAt: new Date(),
    });
  }

  async updateType(id: string, type: ReactionType): Promise<void> {
    await this.collection.doc(id).update({
      type,
    });
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
