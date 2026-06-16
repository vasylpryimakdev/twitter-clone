import { NotFoundException } from "@nestjs/common";
import {
  DocumentData,
  Firestore,
  Transaction,
  UpdateData,
  WithFieldValue,
} from "firebase-admin/firestore";
import { mapDoc } from "./firestore.mapper";

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

  async getDataOrThrow(tx: Transaction, id: string): Promise<ReadModel> {
    const snap = await tx.get(this.getRef(id));

    if (!snap.exists) {
      throw new NotFoundException(`${this.collectionName} not found`);
    }

    return mapDoc<ReadModel>(snap);
  }

  // -------------------
  // WRITE
  // -------------------
  create(tx: Transaction, id: string, data: WriteModel): void {
    tx.create(this.getRef(id), data);
  }

  set(tx: Transaction, id: string, data: WriteModel): void {
    tx.set(this.getRef(id), data);
  }

  update(
    tx: Transaction,
    id: string,
    data: UpdateData<Partial<WriteModel>>,
  ): void {
    tx.update(this.getRef(id), data);
  }

  async updateDirect(
    id: string,
    data: UpdateData<Partial<WriteModel>>,
  ): Promise<void> {
    await this.getRef(id).update(data);
  }

  delete(tx: Transaction, id: string): void {
    tx.delete(this.getRef(id));
  }
}
