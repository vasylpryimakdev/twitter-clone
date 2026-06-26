export interface PostImpact {
  commentsDelta: number;
  likesDelta: number;
  dislikesDelta: number;
  scoreDelta: number;
}

export type PostUpdate = {
  postId: string;
  commentsDelta: number;
  likesDelta: number;
  dislikesDelta: number;
  scoreDelta: number;
};
