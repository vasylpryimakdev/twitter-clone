import { useQuery } from "@tanstack/react-query";
import { postsService } from "../services/posts.service";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: postsService.getPosts,
    select: (res) => res.data,
  });
};
