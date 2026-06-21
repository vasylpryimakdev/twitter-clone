import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repliesService } from "../services/replies.service";
import { handleError } from "../shared/errors/handleError";
import type { Reply } from "../types/reply.types";

export const useReplies = (commentId: string) => {
  return useQuery<Reply[], Error>({
    queryKey: ["replies", commentId],
    queryFn: async () => {
      const res = await repliesService.getByCommentId(commentId);
      return res.data;
    },
    enabled: !!commentId,
  });
};

export const useCreateReply = (commentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => repliesService.create(commentId, { text }),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["replies", commentId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["comments"],
        }),
      ]);
    },

    onError: handleError,
  });
};

export const useUpdateReply = (commentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ replyId, text }: { replyId: string; text: string }) =>
      repliesService.update(replyId, text),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["replies", commentId],
      });
    },

    onError: handleError,
  });
};

export const useDeleteReply = (commentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (replyId: string) => repliesService.delete(replyId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["replies", commentId],
      });
    },

    onError: handleError,
  });
};
