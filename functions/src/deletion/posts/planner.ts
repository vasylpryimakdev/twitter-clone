import { Injectable } from "@nestjs/common";
import { ReactionsRepository } from "../../reactions/reactions.repository";
import { PostDeletionPlan } from "../types/post";
import { CommentDeletionPlanner } from "../comments/planner";

@Injectable()
export class PostDeletionPlanner {
  constructor(
    private readonly reactionsRepo: ReactionsRepository,
    private readonly commentDeletionPlanner: CommentDeletionPlanner,
  ) {}

  async buildPostDeletionPlan(postId: string): Promise<PostDeletionPlan> {
    const commentsPlan = await this.commentDeletionPlanner.buildByPost(postId);
    const reactions = await this.reactionsRepo.findByPost(postId);
    const reactionIds = reactions.data.map((r) => r.id);

    return {
      postId,

      cascadeCommentIds: commentsPlan.cascadeCommentIds,
      postImpact: commentsPlan.postImpact,
      parentImpact: commentsPlan.parentImpact,

      reactionIds,
    };
  }
}
