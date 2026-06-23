import { Inject, Injectable } from "@nestjs/common";
import { Firestore, Transaction } from "firebase-admin/firestore";
import { FIRESTORE } from "./firebase.constants";

@Injectable()
export class FirestoreService {
  constructor(
    @Inject(FIRESTORE)
    private readonly firestore: Firestore,
  ) {}

  runTransaction<T>(handler: (tx: Transaction) => Promise<T>): Promise<T> {
    return this.firestore.runTransaction(handler);
  }

  collection(name: string) {
    return this.firestore.collection(name);
  }
}
