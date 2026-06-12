import type { DocumentSnapshot } from "firebase-admin/firestore";
import { mapTimestamp } from "./firestore-date.util";

export function mapDoc<T>(doc: DocumentSnapshot): T | null {
  if (!doc.exists) return null;

  const data = doc.data();

  if (!data) return null;

  return {
    uid: doc.id,
    ...data,
    createdAt: mapTimestamp(data.createdAt),
    updatedAt: mapTimestamp(data.updatedAt),
  } as T;
}
