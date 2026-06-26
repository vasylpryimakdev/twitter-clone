import { Injectable } from "@nestjs/common";

import { PostsRepository } from "../../posts/posts.repository";
import { ReactionsRepository } from "../../reactions/reactions.repository";
import { ReactionTypes } from "../../reactions/reaction.entity";
import { POST_SCORE_WEIGHTS } from "../../posts/posts.constants";

@Injectable()
export class ReactionsDeletionService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly reactionsRepository: ReactionsRepository,
  ) {}

  async deleteUserReactions(userId: string, tx: FirebaseFirestore.Transaction) {
    const reactions = await this.reactionsRepository.findByUser(userId);

    if (!reactions.length) return;

    const postRefs = reactions.map((r) =>
      this.postsRepository.getRef(r.postId),
    );

    const postSnaps = await Promise.all(postRefs.map((ref) => tx.get(ref)));

    const postsMap = new Map<string, any>();

    postSnaps.forEach((snap, idx) => {
      if (snap.exists) {
        postsMap.set(postRefs[idx].id, snap.data());
      }
    });

    for (const r of reactions) {
      const post = postsMap.get(r.postId);
      if (!post) continue;

      const postRef = this.postsRepository.getRef(r.postId);

      if (r.type === ReactionTypes.LIKE) {
        tx.update(postRef, {
          likesCount: Math.max((post.likesCount ?? 0) - 1, 0),
          score: (post.score ?? 0) - POST_SCORE_WEIGHTS.LIKE,
        });
      }

      if (r.type === ReactionTypes.DISLIKE) {
        tx.update(postRef, {
          dislikesCount: Math.max((post.dislikesCount ?? 0) - 1, 0),
          score: (post.score ?? 0) - POST_SCORE_WEIGHTS.DISLIKE,
        });
      }

      this.reactionsRepository.deleteReaction(r.postId, r.userId, tx);
    }
  }

  async deletePostReactions(postId: string, tx: FirebaseFirestore.Transaction) {
    const reactions = await this.reactionsRepository.findByPost(postId);

    for (const r of reactions.data) {
      this.reactionsRepository.deleteReaction(r.postId, r.userId, tx);
    }
  }
}
