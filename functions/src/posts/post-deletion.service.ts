import { Injectable } from "@nestjs/common";

import { PostsRepository } from "./posts.repository";
import { CommentsRepository } from "../comments/comments.repository";
import { ReactionsRepository } from "../reactions/reactions.repository";
import { FirestoreService } from "../common/firebase/firebase.service";

@Injectable()
export class PostDeletionService {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly reactionsRepository: ReactionsRepository,
  ) {}

  async deletePost(postId: string) {
    await this.firestoreService.runTransaction(async (tx) => {
      const postReactions = await this.reactionsRepository.findByPost(postId);

      for (const r of postReactions.data) {
        this.reactionsRepository.deleteReaction(r.postId, r.userId, tx);
      }

      const postComments = await this.commentsRepository.findByPost(postId);

      for (const c of postComments) {
        this.commentsRepository.delete(c.id, tx);
      }

      this.postsRepository.delete(postId, tx);
    });
  }
}
