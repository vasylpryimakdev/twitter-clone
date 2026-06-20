import { Inject, Injectable } from "@nestjs/common";
import { Firestore } from "firebase-admin/firestore";

import { UsersRepository } from "./users.respository";
import { PostsRepository } from "../posts/posts.repository";
import { CommentsRepository } from "../comments/comments.repository";
import { ReactionsRepository } from "../reactions/reactions.repository";
import { FIRESTORE } from "../common/firestore/firestore.provider";
import { StorageService } from "../storage/storage.service";

@Injectable()
export class UserDeletionService {
  constructor(
    @Inject(FIRESTORE) private readonly firestore: Firestore,
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly reactionsRepository: ReactionsRepository,
    private readonly storageService: StorageService,
  ) {}

  async deleteUser(userId: string) {
    await this.firestore.runTransaction(async (tx) => {
      const user = await this.usersRepository.getDataOrThrow(userId, tx);

      if (user.avatar?.type === "upload") {
        await this.storageService.deleteFile(user.avatar.path!);
      }

      const userReactions = await this.reactionsRepository.findByUser(userId);

      for (const r of userReactions) {
        await this.reactionsRepository.delete(r.postId, r.userId, tx);
      }

      const userComments = await this.commentsRepository.findByAuthor(userId);

      for (const c of userComments) {
        await this.commentsRepository.delete(c.id, tx);
      }

      const userPosts = await this.postsRepository.findByUser(userId, 1000);

      for (const p of userPosts.docs) {
        if (p.image) {
          await this.storageService.deleteFile(p.image.path);
        }

        await this.postsRepository.delete(p.id, tx);
      }

      await this.usersRepository.delete(userId, tx);
    });
  }
}
