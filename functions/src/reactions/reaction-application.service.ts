import { Injectable, NotFoundException, Inject } from "@nestjs/common";

import { ReactionsRepository } from "./reactions.repository";
import { PostsRepository } from "../posts/posts.repository";
import { ReactionType } from "./types/reaction.entity";
import { Firestore } from "firebase-admin/firestore";

@Injectable()
export class ReactionApplicationService {
  constructor(
    private readonly reactionsRepository: ReactionsRepository,
    private readonly postsRepository: PostsRepository,
    @Inject("FIRESTORE")
    private readonly firestore: Firestore,
  ) {}

  async react(userId: string, postId: string, type: ReactionType) {
    const postRef = this.postsRepository.getRef(postId);
    const reactionRef = this.reactionsRepository.getRef(postId, userId);

    return this.firestore.runTransaction(async (tx) => {
      const [postSnap, reactionSnap] = await Promise.all([
        tx.get(postRef),
        tx.get(reactionRef),
      ]);

      if (!postSnap.exists) {
        throw new NotFoundException("Post not found");
      }

      const post = postSnap.data() as {
        likesCount: number;
        dislikesCount: number;
      };

      const existing = reactionSnap.exists
        ? (reactionSnap.data() as { type: ReactionType })
        : null;

      let likeDelta = 0;
      let dislikeDelta = 0;

      if (!existing) {
        tx.set(reactionRef, {
          userId,
          postId,
          type,
        });

        if (type === "like") likeDelta = 1;
        else dislikeDelta = 1;
      }

      else if (existing.type === type) {
        tx.delete(reactionRef);

        if (type === "like") likeDelta = -1;
        else dislikeDelta = -1;
      }

      else {
        tx.set(reactionRef, {
          userId,
          postId,
          type,
        });

        if (type === "like") {
          likeDelta = 1;
          dislikeDelta = -1;
        } else {
          likeDelta = -1;
          dislikeDelta = 1;
        }
      }

      tx.update(postRef, {
        likesCount: (post.likesCount || 0) + likeDelta,
        dislikesCount: (post.dislikesCount || 0) + dislikeDelta,
      });
    });
  }
}
