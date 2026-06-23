import { Injectable } from "@nestjs/common";

import { UsersRepository } from "./users.repository";
import { PostsRepository } from "../posts/posts.repository";
import { CommentsRepository } from "../comments/comments.repository";
import { ReactionsRepository } from "../reactions/reactions.repository";
import { StorageService } from "../common/firebase/storage/storage.service";
import { FirestoreService } from "../common/firebase/firebase.service";

@Injectable()
export class UserDeletionService {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly storageService: StorageService,
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly reactionsRepository: ReactionsRepository,
  ) {}

  async deleteUser(userId: string) {
    await this.firestoreService.runTransaction(async (tx) => {
      const user = await this.usersRepository.getDataOrThrow(userId, tx);

      if (user.avatar?.type === "upload") {
        await this.storageService.deleteFile(user.avatar.path!);
      }

      const userReactions = await this.reactionsRepository.findByUser(userId);

      for (const r of userReactions) {
        await this.reactionsRepository.deleteReaction(r.postId, r.userId, tx);
      }

      const userComments = await this.commentsRepository.findByAuthor(userId);

      for (const c of userComments) {
        await this.commentsRepository.delete(c.id, tx);
      }

      const userPosts = await this.postsRepository.findPosts({
        userId,
        limit: 1000,
      });

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
