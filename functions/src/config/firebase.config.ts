import * as admin from "firebase-admin";

export function initFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: "twitter-like-app-ddb7b",
      storageBucket: "twitter-like-app-ddb7b.firebasestorage.app",
    });
  }

  return admin;
}

export const firebaseAdmin = initFirebaseAdmin();
