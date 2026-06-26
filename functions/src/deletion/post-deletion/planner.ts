import { Injectable } from "@nestjs/common";
import { CommentsRepository } from "../../comments/comments.repository";
import { ReactionsRepository } from "../../reactions/reactions.repository";
import { PostDeletionPlan } from "../types/post-deletion-plan";

@Injectable()
export class PostDeletionPlanner {
  constructor(
    private readonly commentsRepo: CommentsRepository,
    private readonly reactionsRepo: ReactionsRepository,
  ) {}

  async buildPostDeletionPlan(postId: string): Promise<PostDeletionPlan> {
    const comments = await this.commentsRepo.findByPost(postId);

    const commentIds = comments.map((c) => c.id);

    const reactions = await this.reactionsRepo.findByPost(postId);

    const reactionIds = reactions.data.map((r) => r.id);

    const replyIds: string[] = [];

    const queue = [...commentIds];

    while (queue.length) {
      const batch = queue.splice(0, 20);

      const replies = await Promise.all(
        batch.map((id) => this.commentsRepo.findReplies(id)),
      );

      for (const res of replies) {
        for (const r of res.data) {
          replyIds.push(r.id);
          queue.push(r.id);
        }
      }
    }

    return {
      postId,
      commentIds,
      replyIds,
      reactionIds,
    };
  }
}
