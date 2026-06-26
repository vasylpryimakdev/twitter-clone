import { Injectable } from "@nestjs/common";

import { StorageService } from "../../common/firebase/storage/storage.service";
import { PostsRepository } from "../../posts/posts.repository";
import { ReactionsDeletionService } from "./reactions-deletion.service";
import { CommentsDeletionService } from "./comments-deletion.service";

@Injectable()
export class PostsDeletionService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly reactionsDeletionService: ReactionsDeletionService,
    private readonly commentsDeletionService: CommentsDeletionService,
    private readonly storageService: StorageService,
  ) {}

  async deleteUserPosts(userId: string, tx: FirebaseFirestore.Transaction) {
    const posts = await this.postsRepository.findPosts({
      userId,
      limit: 1000,
    });

    for (const p of posts.docs) {
      const postRef = this.postsRepository.getRef(p.id);
      const postSnap = await tx.get(postRef);

      if (!postSnap.exists) continue;

      const post = postSnap.data();
      if (!post) continue;

      await this.reactionsDeletionService.deletePostReactions(p.id, tx);

      await this.commentsDeletionService.deletePostComments(p.id, tx);

      if (p.image?.path) {
        await this.storageService.deleteFile(p.image.path);
      }

      tx.delete(postRef);
    }
  }
}
