import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  commentsService,
  type CommentsResponse,
} from "../services/comments.service";
import { useQueryErrorHandler } from "./useQueryErrorHandler";
import { handleError } from "../shared/errors/handleError";
import type { PostsFeedResponse } from "../types/post.types";
import { useAuthStore } from "../stores/auth.store";
import { useNavigate } from "react-router-dom";

type Cursor = string | undefined;

export const useComments = (postId?: string) => {
  const query = useInfiniteQuery<
    CommentsResponse,
    Error,
    InfiniteData<CommentsResponse>,
    [string, string | undefined],
    Cursor
  >({
    queryKey: ["comments", postId],

    queryFn: ({ pageParam }) =>
      commentsService.getByPostId(postId!, pageParam, 20),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,

    enabled: !!postId,
  });

  useQueryErrorHandler(query.error, query.isError);

  const comments = query.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    ...query,
    comments,
  };
};

export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const status = useAuthStore((s) => s.status);

  return useMutation({
    mutationFn: async (text: string) => {
      if (status === "unauthenticated") {
        navigate("/login");
        throw new Error("Unauthorized");
      }

      return commentsService.create(postId, { text });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });

      queryClient.setQueryData<InfiniteData<PostsFeedResponse>>(
        ["posts", "feed"],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((post) =>
                post.id === postId
                  ? {
                      ...post,
                      commentsCount: Math.max(0, (post.commentsCount ?? 0) + 1),
                    }
                  : post,
              ),
            })),
          };
        },
      );
    },

    onError: handleError,
  });
};

export const useUpdateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      commentsService.update(commentId, text),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },

    onError: handleError,
  });
};

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentsService.delete(commentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });

      queryClient.setQueryData<InfiniteData<PostsFeedResponse>>(
        ["posts", "feed"],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((post) =>
                post.id === postId
                  ? {
                      ...post,
                      commentsCount: Math.max(0, (post.commentsCount ?? 0) - 1),
                    }
                  : post,
              ),
            })),
          };
        },
      );
    },

    onError: handleError,
  });
};
