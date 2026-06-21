import { useQuery } from "@tanstack/react-query";
import { commentsService } from "../services/comments.service";

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => commentsService.getByPostId(postId),
    enabled: !!postId,
    staleTime: 0,
  });
};
