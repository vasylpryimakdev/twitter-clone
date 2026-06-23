import { Provider } from "@nestjs/common";
import { FIREBASE_APP, FIRESTORE } from "../firebase.constants";
import { App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export const firestoreProvider: Provider = {
  provide: FIRESTORE,
  inject: [FIREBASE_APP],
  useFactory: (app: App) => {
    return getFirestore(app);
  },
};
