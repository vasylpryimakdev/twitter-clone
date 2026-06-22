import * as admin from "firebase-admin";

export function initFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
    });
  }

  return admin;
}

export const firebaseAdmin = initFirebaseAdmin();
