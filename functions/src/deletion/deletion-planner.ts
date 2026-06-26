import { Injectable } from "@nestjs/common";
import { PostsRepository } from "../posts/posts.repository";
import { CommentsRepository } from "../comments/comments.repository";
import { ReactionsRepository } from "../reactions/reactions.repository";
import { POST_SCORE_WEIGHTS } from "../posts/posts.constants";

type PostImpact = {
  commentsDelta: number;
  likesDelta: number;
  dislikesDelta: number;
  scoreDelta: number;
};

type ParentCommentImpact = {
  repliesDelta: number;
};

@Injectable()
export class DeletionPlanner {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly commentsRepo: CommentsRepository,
    private readonly reactionsRepo: ReactionsRepository,
  ) {}

  async buildUserDeletionPlan(userId: string) {
    // -------------------------
    // 1. POSTS OWNED BY USER
    // -------------------------
    const posts = await this.postsRepo.findPosts({ userId, limit: 1000 });

    const postIds = posts.docs.map((p) => p.id);

    // all comments/reactions under user posts
    let postCommentIds: string[] = [];
    let postReactionIds: string[] = [];

    for (const post of posts.docs) {
      const comments = await this.commentsRepo.findByPost(post.id);
      const reactions = await this.reactionsRepo.findByPost(post.id);

      postCommentIds.push(...comments.map((c) => c.id));
      postReactionIds.push(...reactions.data.map((r) => r.id));
    }

    // -------------------------
    // 2. COMMENTS BY USER
    // -------------------------
    const userComments = await this.commentsRepo.findByAuthor(userId);

    const userCommentIds = userComments.map((c) => c.id);

    const orphanCommentIds: string[] = [];
    const parentImpact = new Map<string, ParentCommentImpact>();
    const postImpactFromComments = new Map<string, PostImpact>();

    for (const c of userComments) {
      const postId = c.postId;

      // post impact
      const post = postImpactFromComments.get(postId) || {
        commentsDelta: 0,
        scoreDelta: 0,
        likesDelta: 0,
        dislikesDelta: 0,
      };

      post.commentsDelta -= 1;

      post.scoreDelta -= c.parentId
        ? POST_SCORE_WEIGHTS.REPLY
        : POST_SCORE_WEIGHTS.COMMENT;

      postImpactFromComments.set(postId, post);

      // parent comment impact
      if (c.parentId) {
        const parent = parentImpact.get(c.parentId) || {
          repliesDelta: 0,
        };

        parent.repliesDelta -= 1;
        parentImpact.set(c.parentId, parent);
      }

      // collect replies
      if (c.repliesCount && c.repliesCount > 0) {
        const replies = await this.commentsRepo.findReplies(c.id);
        orphanCommentIds.push(...replies.data.map((r) => r.id));
      }
    }

    // -------------------------
    // 3. REACTIONS BY USER
    // -------------------------
    const userReactions = await this.reactionsRepo.findByUser(userId);

    const userReactionIds = userReactions.map((r) => r.id);

    const postImpactFromReactions = new Map<string, PostImpact>();

    for (const r of userReactions) {
      const postId = r.postId;

      const post = postImpactFromReactions.get(postId) || {
        commentsDelta: 0,
        likesDelta: 0,
        dislikesDelta: 0,
        scoreDelta: 0,
      };

      if (r.type === "like") {
        post.likesDelta -= 1;
        post.scoreDelta -= POST_SCORE_WEIGHTS.LIKE;
      }

      if (r.type === "dislike") {
        post.dislikesDelta -= 1;
        post.scoreDelta -= POST_SCORE_WEIGHTS.DISLIKE;
      }

      postImpactFromReactions.set(postId, post);
    }

    // -------------------------
    // 4. MERGE POST IMPACTS
    // -------------------------
    const postImpact = new Map<string, PostImpact>();

    const merge = (map: Map<string, PostImpact>) => {
      for (const [postId, impact] of map.entries()) {
        const prev = postImpact.get(postId) || {
          commentsDelta: 0,
          likesDelta: 0,
          dislikesDelta: 0,
          scoreDelta: 0,
        };

        postImpact.set(postId, {
          commentsDelta: prev.commentsDelta + impact.commentsDelta,
          likesDelta: prev.likesDelta + impact.likesDelta,
          dislikesDelta: prev.dislikesDelta + impact.dislikesDelta,
          scoreDelta: prev.scoreDelta + impact.scoreDelta,
        });
      }
    };

    merge(postImpactFromComments);
    merge(postImpactFromReactions);

    // -------------------------
    // FINAL PLAN
    // -------------------------
    return {
      // POSTS
      postIds,

      // COMMENTS
      postCommentIds,
      userCommentIds,
      orphanCommentIds,

      // REACTIONS
      postReactionIds,
      userReactionIds,

      // IMPACTS
      postImpact,
      parentImpact,
    };
  }
}
