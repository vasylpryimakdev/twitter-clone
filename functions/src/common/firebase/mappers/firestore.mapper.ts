import { DocumentSnapshot } from "firebase-admin/firestore";
import { mapTimestamp } from "./firestore-date.util";

export function mapDocBase(doc: DocumentSnapshot) {
  const data = doc.data();

  if (!data) {
    throw new Error("Invalid Firestore document");
  }

  return {
    id: doc.id,
    ...data,
  };
}

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
