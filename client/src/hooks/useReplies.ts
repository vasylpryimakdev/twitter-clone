import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  repliesService,
  type RepliesResponse,
} from "../services/replies.service";
import { handleError } from "../shared/errors/handleError";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import type { Post, PostsQueryData } from "../types/post.types";
import type { Comment, CommentsQueryData } from "../types/comment.types";
import { useQueryErrorHandler } from "./useQueryErrorHandler";
import type { CommentsResponse } from "../services/comments.service";
import {
  removeFromInfinitePages,
  updateInfinitePages,
} from "../shared/utils/reactQuery";
import type { DeleteReplyContext, Reply } from "../types/reply.types";

type Cursor = string | undefined;

export const useReplies = (commentId: string) => {
  const query = useInfiniteQuery<
    RepliesResponse,
    Error,
    InfiniteData<RepliesResponse>,
    [string, string],
    Cursor
  >({
    queryKey: ["replies", commentId],

    queryFn: ({ pageParam }) =>
      repliesService.getByCommentId(commentId, pageParam, 20),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,

    enabled: !!commentId,
  });

  useQueryErrorHandler(query.error, query.isError);

  const replies = query.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    ...query,
    replies,
  };
};

export const useCreateReply = (postId: string, commentId: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const status = useAuthStore((s) => s.status);

  return useMutation({
    mutationFn: (text: string) => {
      if (status === "unauthenticated") {
        navigate("/login");
        throw new Error("Unauthorized");
      }

      return repliesService.create(commentId, { text });
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["replies", commentId] });
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousReplies = queryClient.getQueryData(["replies", commentId]);
      const previousComments = queryClient.getQueryData(["comments", postId]);
      const previousPosts = queryClient.getQueriesData({ queryKey: ["posts"] });

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

      queryClient.setQueriesData(
        { queryKey: ["comments", postId] },
        (old: CommentsQueryData | undefined) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    repliesCount: (comment.repliesCount ?? 0) + 1,
                  }
                : comment,
            ),
          };
        },
      );

      return {
        previousReplies,
        previousComments,
        previousPosts,
      };
    },

    onSuccess: async (newReply) => {
      queryClient.setQueriesData<InfiniteData<CommentsResponse>>(
        { queryKey: ["comments", postId] },
        (old) => {
          if (!old?.pages) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      repliesCount: (comment.repliesCount ?? 0) + 1,
                    }
                  : comment,
              ),
            })),
          };
        },
      );

      queryClient.setQueryData<InfiniteData<RepliesResponse>>(
        ["replies", commentId],
        (old) => {
          if (!old) return old;

          const firstPage = old.pages[0];

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                data: [newReply, ...firstPage.data],
              },
              ...old.pages.slice(1),
            ],
          };
        },
      );
    },

    onError: (err, _vars, ctx) => {
      console.log(err);
      handleError(err);

      if (ctx?.previousReplies) {
        queryClient.setQueryData(["replies", commentId], ctx.previousReplies);
      }

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

  return useMutation<void, Error, string, DeleteReplyContext>({
    mutationFn: (replyId: string) => repliesService.delete(replyId),

    onMutate: async (replyId: string) => {
      await queryClient.cancelQueries({ queryKey: ["replies", commentId] });
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousReplies = queryClient.getQueryData<
        InfiniteData<RepliesResponse>
      >(["replies", commentId]);
      const previousComments = queryClient.getQueryData<
        InfiniteData<CommentsResponse>
      >(["comments", postId]);
      const previousPosts = queryClient.getQueriesData<PostsQueryData>({
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
                    commentsCount: (post.commentsCount ?? 0) - 1,
                  }
                : post,
            ),
          };
        },
      );

      queryClient.setQueriesData(
        { queryKey: ["comments", postId] },
        (old: CommentsQueryData | undefined) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    repliesCount: (comment.repliesCount ?? 0) - 1,
                  }
                : comment,
            ),
          };
        },
      );

      queryClient.setQueryData<InfiniteData<RepliesResponse>>(
        ["replies", commentId],
        (old) => {
          if (!old?.pages) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((r) => r.id !== replyId),
            })),
          };
        },
      );

      return {
        previousReplies,
        previousComments,
        previousPosts,
      };
    },

    onSuccess: (_data, replyId) => {
      queryClient.setQueriesData(
        { queryKey: ["comments", postId] },
        (old: InfiniteData<CommentsResponse> | undefined) =>
          updateInfinitePages<Comment, CommentsResponse>(
            old,
            (comment) => ({
              ...comment,
              repliesCount: comment.repliesCount - 1,
            }),
            (comment) => comment.id === commentId,
          ),
      );

      queryClient.setQueryData(
        ["replies", commentId],
        (old: InfiniteData<RepliesResponse> | undefined) =>
          removeFromInfinitePages<Reply, RepliesResponse>(
            old,
            (reply) => reply.id === replyId,
          ),
      );
    },

    onError: (err, _vars, ctx) => {
      console.log(err);
      handleError(err);

      if (ctx?.previousReplies) {
        queryClient.setQueryData(["replies", commentId], ctx.previousReplies);
      }

      if (ctx?.previousComments) {
        queryClient.setQueryData(["comments", postId], ctx.previousComments);
      }

      if (ctx?.previousPosts) {
        ctx.previousPosts.forEach(([key, data]) => {
          queryClient.setQueryData(key as readonly unknown[], data);
        });
      }
    },

    onSettled: () => {},
  });
};
