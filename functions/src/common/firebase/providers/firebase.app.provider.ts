import { Provider } from "@nestjs/common";
import * as admin from "firebase-admin";
import { FIREBASE_APP } from "../firebase.constants";
import { App } from "firebase-admin/app";

export const firebaseAppProvider: Provider = {
  provide: FIREBASE_APP,
  useFactory: (): App => {
    if (!admin.apps.length) {
      return admin.initializeApp({
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
      });
    }

    return admin.app();
  },
};
