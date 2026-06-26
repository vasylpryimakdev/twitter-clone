import { Injectable } from "@nestjs/common";

import { CommentsRepository } from "../../comments/comments.repository";
import { PostsRepository } from "../../posts/posts.repository";
import { POST_SCORE_WEIGHTS } from "../../posts/posts.constants";

@Injectable()
export class CommentsDeletionService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async deleteUserComments(userId: string, tx: FirebaseFirestore.Transaction) {
    const comments = await this.commentsRepository.findByAuthor(userId);

    if (!comments.length) return;

    const postRefs = comments.map((c) => this.postsRepository.getRef(c.postId));

    const postSnaps = await Promise.all(postRefs.map((ref) => tx.get(ref)));

    const postsMap = new Map<string, any>();

    postSnaps.forEach((snap, i) => {
      if (snap.exists) {
        postsMap.set(postRefs[i].id, snap.data());
      }
    });

    const parentComments = comments.filter((c) => c.parentId);

    const parentRefs = parentComments.map((c) =>
      this.commentsRepository.getRef(c.parentId!),
    );

    const parentSnaps = await Promise.all(parentRefs.map((ref) => tx.get(ref)));

    const parentsMap = new Map<string, any>();

    parentSnaps.forEach((snap, i) => {
      if (snap.exists) {
        parentsMap.set(parentRefs[i].id, snap.data());
      }
    });

    for (const c of comments) {
      const post = postsMap.get(c.postId);
      if (!post) continue;

      const postRef = this.postsRepository.getRef(c.postId);

      const isReply = !!c.parentId;

      const scorePenalty = isReply
        ? POST_SCORE_WEIGHTS.REPLY
        : POST_SCORE_WEIGHTS.COMMENT;

      tx.update(postRef, {
        commentsCount: Math.max((post.commentsCount ?? 0) - 1, 0),
        score: (post.score ?? 0) - scorePenalty,
      });

      if (c.parentId) {
        const parent = parentsMap.get(c.parentId);

        if (parent) {
          const parentRef = this.commentsRepository.getRef(c.parentId);

          tx.update(parentRef, {
            repliesCount: Math.max((parent.repliesCount ?? 1) - 1, 0),
          });
        }
      }

      if (c.repliesCount && c.repliesCount > 0) {
        const replies = await this.commentsRepository.findReplies(c.id);

        for (const reply of replies.data) {
          this.commentsRepository.delete(reply.id, tx);
        }
      }

      this.commentsRepository.delete(c.id, tx);
    }
  }

  async deletePostComments(postId: string, tx: FirebaseFirestore.Transaction) {
    const comments = await this.commentsRepository.findByPost(postId);

    for (const c of comments) {
      this.commentsRepository.delete(c.id, tx);
    }
  }
}
