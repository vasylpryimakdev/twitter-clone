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
    return this.firestore.runTransaction(async (tx) => {
      await this.postsRepository.getDataOrThrow(postId, tx);

      const existing = await this.reactionsRepository.get(postId, userId, tx);

      const isLike = type === "like";

      const targetField = isLike
        ? PostCounterFields.LIKES
        : PostCounterFields.DISLIKES;

      const oppositeField = isLike
        ? PostCounterFields.DISLIKES
        : PostCounterFields.LIKES;

      if (!existing) {
        this.reactionsRepository.set(postId, userId, type, tx);

        await this.postsRepository.adjustCounter(postId, targetField, 1, tx);
        return;
      }

      if (existing.type === type) {
        this.reactionsRepository.delete(postId, userId, tx);

        await this.postsRepository.adjustCounter(postId, targetField, -1, tx);
        return;
      }

      this.reactionsRepository.set(postId, userId, type, tx);

      await this.postsRepository.adjustCounter(postId, targetField, 1, tx);
      await this.postsRepository.adjustCounter(postId, oppositeField, -1, tx);
    });
  }
}
