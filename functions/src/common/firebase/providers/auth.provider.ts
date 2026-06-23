import { Provider } from "@nestjs/common";
import { FIREBASE_APP, FIREBASE_AUTH } from "../firebase.constants";
import { App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export const authProvider: Provider = {
  provide: FIREBASE_AUTH,
  inject: [FIREBASE_APP],
  useFactory: (app: App) => {
    return getAuth(app);
  },
};
