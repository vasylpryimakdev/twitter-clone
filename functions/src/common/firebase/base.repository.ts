import { NotFoundException } from "@nestjs/common";
import {
  DocumentData,
  Firestore,
  Transaction,
  UpdateData,
  WithFieldValue,
  Query,
  QuerySnapshot,
} from "firebase-admin/firestore";
import { mapDoc } from "./mappers/firestore.mapper";

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

  protected query(): Query {
    return this.collection;
  }

  protected runQuery(query: Query): Promise<QuerySnapshot<DocumentData>> {
    return query.get();
  }

  getRef(id: string) {
    return this.collection.doc(id);
  }

  createId(): string {
    return this.collection.doc().id;
  }

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

  async create(id: string, data: WriteModel, tx?: Transaction) {
    const ref = this.getRef(id);

    if (tx) return tx.create(ref, data);
    return ref.create(data);
  }

  async set(id: string, data: WriteModel, tx?: Transaction) {
    const ref = this.getRef(id);

    if (tx) return tx.set(ref, data);
    return ref.set(data);
  }

  async update(
    id: string,
    data: UpdateData<Partial<WriteModel>>,
    tx?: Transaction,
  ) {
    const ref = this.getRef(id);

    if (tx) return tx.update(ref, data);
    return ref.update(data);
  }

  async delete(id: string, tx?: Transaction) {
    const ref = this.getRef(id);

    if (tx) return tx.delete(ref);
    return ref.delete();
  }

  async countDocs<T>(query: FirebaseFirestore.Query<T>): Promise<number> {
    const snapshot = await query.count().get();
    return snapshot.data().count;
  }
}
