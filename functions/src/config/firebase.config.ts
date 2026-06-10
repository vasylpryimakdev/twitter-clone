import * as admin from "firebase-admin";

export function initFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: process.env.PROJECT_ID,
    });
  }

  return admin;
}

export const firebaseAdmin = initFirebaseAdmin();
