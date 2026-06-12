import type { DocumentSnapshot } from "firebase-admin/firestore";
import { mapTimestamp } from "../firestore/firestore-date.util";

export function mapDoc<T>(doc: DocumentSnapshot): T {
  const data = doc.data();

  if (!data) {
    throw new Error("Invalid Firestore document: missing data");
  }

  return {
    id: doc.id,
    ...data,
    createdAt: mapTimestamp(data.createdAt),
    updatedAt: mapTimestamp(data.updatedAt),
  } as T;
}
