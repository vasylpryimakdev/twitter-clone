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
import type { Post, PostsQueryData } from "../types/post.types";
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

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousComments = queryClient.getQueryData(["comments", postId]);
      const previousPosts = queryClient.getQueriesData({
        queryKey: ["posts"],
      });

      queryClient.setQueriesData<PostsQueryData>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.map((post: Post) =>
              post.id === postId
                ? {
                    ...post,
                    commentsCount: (post.commentsCount ?? 0) + 1,
                  }
                : post,
            ),
          };
        },
      );

      return {
        previousComments,
        previousPosts,
      };
    },

    onSuccess: (newComment) => {
      queryClient.setQueryData<InfiniteData<CommentsResponse>>(
        ["comments", postId],
        (old) => {
          if (!old) return old;

          const firstPage = old.pages[0];

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                data: [newComment, ...firstPage.data],
              },
              ...old.pages.slice(1),
            ],
          };
        },
      );
    },

    onError: (err, _vars, ctx) => {
      handleError(err);

      if (ctx?.previousComments) {
        queryClient.setQueryData(["comments", postId], ctx.previousComments);
      }

      if (ctx?.previousPosts) {
        ctx.previousPosts.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {},
  });
};

export const useUpdateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      commentsService.update(commentId, text),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["comments", postId],
      });

      const previousComments = queryClient.getQueryData(["comments", postId]);

      return { previousComments };
    },

    onSuccess: (updatedComment) => {
      queryClient.setQueryData<InfiniteData<CommentsResponse>>(
        ["comments", postId],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((comment) =>
                comment.id === updatedComment.id ? updatedComment : comment,
              ),
            })),
          };
        },
      );
    },

    onError: (err, _vars, ctx) => {
      handleError(err);

      if (ctx?.previousComments) {
        queryClient.setQueryData(["comments", postId], ctx.previousComments);
      }
    },
  });
};

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentsService.delete(commentId),

    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", postId],
      });

      await queryClient.cancelQueries({
        queryKey: ["posts"],
      });

      const previousComments = queryClient.getQueryData(["comments", postId]);

      const previousPosts = queryClient.getQueriesData({
        queryKey: ["posts"],
      });

      queryClient.setQueryData<InfiniteData<CommentsResponse>>(
        ["comments", postId],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((c) => c.id !== commentId),
            })),
          };
        },
      );

      queryClient.setQueriesData<PostsQueryData>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.map((post: Post) =>
              post.id === postId
                ? {
                    ...post,
                    commentsCount: Math.max(0, (post.commentsCount ?? 0) - 1),
                  }
                : post,
            ),
          };
        },
      );

      return {
        previousComments,
        previousPosts,
      };
    },

    onSuccess: () => {},

    onError: (err, _vars, ctx) => {
      handleError(err);

      if (ctx?.previousComments) {
        queryClient.setQueryData(["comments", postId], ctx.previousComments);
      }

      if (ctx?.previousPosts) {
        ctx.previousPosts.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {},
  });
};
