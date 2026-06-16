import { NotFoundException } from "@nestjs/common";
import {
  DocumentData,
  Firestore,
  Transaction,
  UpdateData,
  WithFieldValue,
} from "firebase-admin/firestore";
import { mapDoc } from "./firestore.mapper";
import mapFirestoreError from "./firestore-error.mapper";

export abstract class BaseRepository<
  ReadModel,
  WriteModel extends WithFieldValue<DocumentData>,
> {
  protected constructor(
    protected readonly firestore: Firestore,
    protected readonly collectionName: string,
  ) {}

  protected get collection() {
    return this.firestore.collection(this.collectionName);
  }

  getRef(id: string) {
    return this.collection.doc(id);
  }

  createId(): string {
    return this.collection.doc().id;
  }

  // -------------------
  // READ
  // -------------------
  async findById(id: string): Promise<ReadModel | null> {
    const snap = await this.getRef(id).get();

    if (!snap.exists) return null;

    return mapDoc<ReadModel>(snap);
  }

  async findByIdOrThrow(id: string): Promise<ReadModel> {
    const snap = await this.getRef(id).get();

    if (!snap.exists) {
      throw new NotFoundException(`${this.collectionName} not found`);
    }

    return mapDoc<ReadModel>(snap);
  }

  async getDataOrThrow(id: string, tx: Transaction): Promise<ReadModel> {
    const snap = await tx.get(this.getRef(id));

    if (!snap.exists) {
      throw new NotFoundException(`${this.collectionName} not found`);
    }

    return mapDoc<ReadModel>(snap);
  }

  // -------------------
  // WRITE
  // -------------------
  async create(id: string, data: WriteModel, tx?: Transaction): Promise<void> {
    try {
      const ref = this.getRef(id);

      if (tx) {
        tx.create(ref, data);
        return;
      }

      await ref.create(data);
    } catch (err) {
      mapFirestoreError(err);
    }
  }

  async set(id: string, data: WriteModel, tx?: Transaction): Promise<void> {
    try {
      const ref = this.getRef(id);

      if (tx) {
        tx.set(ref, data);
        return;
      }

      await ref.set(data);
    } catch (err) {
      mapFirestoreError(err);
    }
  }

  async update(
    id: string,
    data: UpdateData<Partial<WriteModel>>,
    tx?: Transaction,
  ): Promise<void> {
    try {
      const ref = this.getRef(id);

      if (tx) {
        tx.update(ref, data);
        return;
      }

      await ref.update(data);
    } catch (err) {
      mapFirestoreError(err);
    }
  }

  async delete(id: string, tx?: Transaction): Promise<void> {
    try {
      const ref = this.getRef(id);

      if (tx) {
        tx.delete(ref);
        return;
      }

      await ref.delete();
    } catch (err) {
      mapFirestoreError(err);
    }
  }
}
