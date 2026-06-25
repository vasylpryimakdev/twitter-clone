import { DocumentSnapshot } from "firebase-admin/firestore";
import { mapTimestamp } from "../../common/firebase/mappers/firestore-date.util";
import { Post } from "../types/post.entity";

export function mapPost(doc: DocumentSnapshot): Post {
  const data = doc.data();

  if (!data) {
    throw new Error("Invalid Firestore document");
  }

  return {
    id: doc.id,

    authorId: data.authorId,
    author: data.author,

    title: data.title,
    text: data.text,

    image: data.image ?? null,

    createdAt: mapTimestamp(data.createdAt),
    updatedAt: mapTimestamp(data.updatedAt),

    likesCount: data.likesCount ?? 0,
    dislikesCount: data.dislikesCount ?? 0,
    commentsCount: data.commentsCount ?? 0,
    score: data.score ?? 0,

    userReaction: data.userReaction ?? null,
  };
}
