import { Post } from "../types/post.entity";

export function toPostResponse(post: Post) {
  const { image, ...rest } = post;

  return {
    ...rest,
    imageUrl: image?.url ?? null,
  };
}
