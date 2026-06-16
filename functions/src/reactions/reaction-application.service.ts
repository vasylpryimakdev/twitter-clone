import { Injectable, Inject } from "@nestjs/common";

import { ReactionsRepository } from "./reactions.repository";
import { PostsRepository } from "../posts/posts.repository";
import { ReactionType } from "./types/reaction.entity";
import { Firestore } from "firebase-admin/firestore";
import { PostCounterFields } from "../posts/types/post-counter-field";

@Injectable()
export class ReactionApplicationService {
  constructor(
    private readonly reactionsRepository: ReactionsRepository,
    private readonly postsRepository: PostsRepository,
    @Inject("FIRESTORE")
    private readonly firestore: Firestore,
  ) {}

  async react(userId: string, postId: string, type: ReactionType) {
    const reactionRef = this.reactionsRepository.getRef(postId, userId);

    return this.firestore.runTransaction(async (tx) => {
      await this.postsRepository.getDataOrThrow(postId, tx);

      const reactionSnap = await tx.get(reactionRef);

      const existing = reactionSnap.exists
        ? (reactionSnap.data() as { type: ReactionType })
        : null;

      if (!existing) {
        tx.set(reactionRef, { userId, postId, type });

        if (type === "like") {
          await this.postsRepository.adjustCounter(
            postId,
            PostCounterFields.LIKES,
            1,
            tx,
          );
        } else {
          await this.postsRepository.adjustCounter(
            postId,
            PostCounterFields.DISLIKES,
            1,
            tx,
          );
        }

        return;
      }

      if (existing.type === type) {
        tx.delete(reactionRef);

        if (type === "like") {
          await this.postsRepository.adjustCounter(
            postId,
            PostCounterFields.LIKES,
            -1,
            tx,
          );
        } else {
          await this.postsRepository.adjustCounter(
            postId,
            PostCounterFields.DISLIKES,
            -1,
            tx,
          );
        }

        return;
      }

      tx.set(reactionRef, { userId, postId, type });

      if (type === "like") {
        await this.postsRepository.adjustCounter(
          postId,
          PostCounterFields.LIKES,
          1,
          tx,
        );

        await this.postsRepository.adjustCounter(
          postId,
          PostCounterFields.DISLIKES,
          -1,
          tx,
        );
      } else {
        await this.postsRepository.adjustCounter(
          postId,
          PostCounterFields.LIKES,
          -1,
          tx,
        );

        await this.postsRepository.adjustCounter(
          postId,
          PostCounterFields.DISLIKES,
          1,
          tx,
        );
      }
    });
  }
}
