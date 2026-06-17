import { Inject, Injectable } from "@nestjs/common";
import { Firestore } from "firebase-admin/firestore";

import { PostsRepository } from "./posts.repository";
import { CommentsRepository } from "../comments/comments.repository";
import { ReactionsRepository } from "../reactions/reactions.repository";
import { FIRESTORE } from "../common/firestore/firestore.provider";

@Injectable()
export class PostDeletionService {
  constructor(
    @Inject(FIRESTORE) private readonly firestore: Firestore,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly reactionsRepository: ReactionsRepository,
  ) {}

  async deletePost(postId: string) {
    await this.firestore.runTransaction(async (tx) => {
      const postReactions = await this.reactionsRepository.findByPost(postId);

      for (const r of postReactions.data) {
        this.reactionsRepository.delete(r.postId, r.userId, tx);
      }

      const postComments = await this.commentsRepository.findByPost(postId);

      for (const c of postComments.data) {
        this.commentsRepository.delete(c.id, tx);
      }

      this.postsRepository.delete(postId, tx);
    });
  }
}
