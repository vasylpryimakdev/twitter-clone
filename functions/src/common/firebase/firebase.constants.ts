export const FIREBASE_APP = "FIREBASE_APP";
export const FIRESTORE = "FIRESTORE";
export const FIREBASE_AUTH = "FIREBASE_AUTH";
export const FIREBASE_BUCKET = "FIREBASE_BUCKET";

export const COLLECTIONS = {
  USERS: "users",
  POSTS: "posts",
  COMMENTS: "comments",
  REACTIONS: "reactions",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
