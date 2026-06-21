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

export const useCreateReply = (postId: string, commentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => repliesService.create(commentId, { text }),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["replies", commentId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["comments", postId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["post", postId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["posts", "feed"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["posts", "user"],
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

export const useDeleteReply = (postId: string, commentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (replyId: string) => repliesService.delete(replyId),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["replies", commentId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["comments", postId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["post", postId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["posts", "feed"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["posts", "user"],
        }),
      ]);
    },

    onError: handleError,
  });
};
