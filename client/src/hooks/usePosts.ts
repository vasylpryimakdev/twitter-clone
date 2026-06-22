import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { postsService } from "../services/posts.service";
import type {
  PostDTO,
  Post,
  PostsInfinite,
  PostsFeedResponse,
} from "../types/post.types";
import { useToastStore } from "../stores/toast.store";
import { handleError } from "../shared/errors/handleError";
import { useNavigate } from "react-router-dom";
import { useQueryErrorHandler } from "./useQueryErrorHandler";
import { reactionsService } from "../services/reactions.service";
import { useAuthStore } from "../stores/auth.store";
import { useState } from "react";

const showToast = useToastStore.getState().showToast;

const LIMIT = 8;

export const usePosts = (params?: { userId?: string; search?: string }) => {
  const initialized = useAuthStore((s) => s.isInitialized);

  const { userId, search } = params ?? {};

  const [page, setPage] = useState(1);

  const [cursors, setCursors] = useState<Record<number, string | null>>({
    1: null,
  });

  const cursor = cursors[page];

  const query = useQuery<PostsFeedResponse>({
    queryKey: ["posts", userId, search, page],

    enabled: initialized && (page === 1 || cursor !== undefined),

    queryFn: () =>
      postsService.getPosts({
        userId,
        search,
        cursor,
        limit: LIMIT,
      }),
  });

  const nextPage = () => {
    const nextCursor = query.data?.nextCursor;
    if (!nextCursor) return;

    setCursors((prev) => ({
      ...prev,
      [page + 1]: nextCursor,
    }));

    setPage((p) => p + 1);
  };

  const prevPage = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const goToPage = (p: number) => {
    if (p < 1) return;
    setPage(p);
  };

  const items = query.data?.data ?? [];
  const hasNextPage = !!query.data?.nextCursor;

  const isFirstPage = page === 1;
  const isLastPage = !hasNextPage;

  return {
    ...query,

    items,
    page,

    isFirstPage,
    isLastPage,

    nextPage,
    prevPage,
    goToPage,

    hasNextPage: !!query.data?.nextCursor,
  };
};

export const usePost = (id?: string) => {
  const query = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => postsService.getPostById(id!),
    enabled: !!id,
  });

  useQueryErrorHandler(query.error, query.isError);

  return query;
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<Post, unknown, PostDTO>({
    mutationFn: postsService.createPost,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts", "feed"] }),
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
      ]);

      showToast("Post created successfully", "success");
      navigate("/");
    },

    onError: handleError,
  });
};

export const useUpdatePost = (id: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<Post, unknown, PostDTO>({
    mutationFn: (data) => postsService.updatePost(id, data),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["post", id] }),
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["posts", "feed"] }),
      ]);

      showToast("Post updated successfully", "success");
      navigate("/");
    },

    onError: handleError,
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    mutationFn: postsService.deletePost,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["posts", "feed"] }),
      ]);

      showToast("Post deleted", "success");
    },

    onError: handleError,
  });
};

export const useReactPost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const status = useAuthStore((s) => s.status);

  return useMutation({
    mutationFn: async ({
      postId,
      type,
    }: {
      postId: string;
      type: "like" | "dislike";
    }) => {
      if (status === "unauthenticated") {
        navigate("/login");
        throw new Error("Unauthorized");
      }

      return reactionsService.react(postId, type);
    },

    onMutate: async ({ postId, type }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousData = queryClient.getQueriesData<PostsInfinite>({
        queryKey: ["posts"],
      });

      queryClient.setQueriesData<PostsInfinite>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((post) => {
                if (post.id !== postId) return post;

                const current = post.userReaction;

                let likes = post.likesCount;
                let dislikes = post.dislikesCount;
                let newReaction: typeof current = type;

                if (current === type) {
                  newReaction = null;

                  if (type === "like") likes--;
                  if (type === "dislike") dislikes--;
                } else {
                  if (current === "like") likes--;
                  if (current === "dislike") dislikes--;

                  if (type === "like") likes++;
                  if (type === "dislike") dislikes++;
                }

                return {
                  ...post,
                  userReaction: newReaction,
                  likesCount: likes,
                  dislikesCount: dislikes,
                };
              }),
            })),
          };
        },
      );

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (!context?.previousData) return;

      context.previousData.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
