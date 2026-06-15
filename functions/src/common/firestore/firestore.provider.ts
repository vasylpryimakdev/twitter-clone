import { firebaseAdmin } from "../../config/firebase.config";
import { Firestore } from "firebase-admin/firestore";

export const FIRESTORE = "FIRESTORE";

export const firestoreProvider = {
  provide: FIRESTORE,
  useFactory: (): Firestore => {
    return firebaseAdmin.firestore();
  },
};
