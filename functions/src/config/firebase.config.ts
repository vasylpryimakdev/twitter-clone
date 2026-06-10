import * as admin from "firebase-admin";

export const firebaseApp = admin.initializeApp();

export const firestore = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
