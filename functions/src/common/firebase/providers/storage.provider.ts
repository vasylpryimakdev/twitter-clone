import { Provider } from "@nestjs/common";
import { FIREBASE_APP, FIREBASE_BUCKET } from "../firebase.constants";
import { App } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

export const storageProvider: Provider = {
  provide: FIREBASE_BUCKET,
  inject: [FIREBASE_APP],
  useFactory: (app: App) => {
    return getStorage(app).bucket();
  },
};
