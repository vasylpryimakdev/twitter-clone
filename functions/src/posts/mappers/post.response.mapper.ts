import { Post } from "../types/post.entity";

export function toPostResponse(post: Post) {
  return {
    ...post,
    imageUrl: post.image?.url ?? null,
  };
}
