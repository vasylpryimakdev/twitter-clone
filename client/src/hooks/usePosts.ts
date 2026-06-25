import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { postsService } from "../services/posts.service";
import type {
  PostDTO,
  Post,
  PostsFeedResponse,
  ReactPostVariables,
  MutationPostsContext,
  PostsQueryData,
} from "../types/post.types";
import { useToastStore } from "../stores/toast.store";
import { handleError } from "../shared/errors/handleError";
import { useNavigate } from "react-router-dom";
import { useQueryErrorHandler } from "./useQueryErrorHandler";
import {
  reactionsService,
  type ReactionType,
} from "../services/reactions.service";
import { useAuthStore } from "../stores/auth.store";
import { useState } from "react";

const showToast = useToastStore.getState().showToast;

const LIMIT = 5;

export const usePosts = (params?: { userId?: string; search?: string }) => {
  const initialized = useAuthStore((s) => s.isInitialized);

  const { userId, search } = params ?? {};

  const [page, setPage] = useState(1);

  const [cursors, setCursors] = useState<Record<number, string | null>>({
    1: null,
  });

  const cursor = page === 1 ? null : cursors[page];
  const isValidCursor = page === 1 || cursor !== null;

  const query = useQuery<PostsFeedResponse>({
    queryKey: ["posts", userId, search, page],

    enabled: initialized && isValidCursor,

    queryFn: () =>
      postsService.getPosts({
        userId,
        search,
        cursor,
        limit: LIMIT,
      }),
  });

  const nextPage = () => {
    if (!query.data?.hasNextPage) return;

    const nextCursor = query.data.nextCursor;
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

  return {
    ...query,

    items,
    page,

    isFirstPage: page === 1,
    isLastPage: !query.data?.hasNextPage,

    nextPage,
    prevPage,
    goToPage,

    hasNextPage: query.data?.hasNextPage ?? false,
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

    onSuccess: (newPost) => {
      queryClient.setQueriesData<PostsQueryData>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: [newPost, ...old.data],
          };
        },
      );

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

    onSuccess: (updatedPost) => {
      queryClient.setQueriesData<PostsQueryData>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.map((p) => (p.id === id ? updatedPost : p)),
          };
        },
      );

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

    onSuccess: (_, postId) => {
      queryClient.setQueriesData<PostsFeedResponse>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.filter((p) => p.id !== postId),
          };
        },
      );

      showToast("Post deleted", "success");
    },

    onError: handleError,
  });
};

export const useReactPost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const status = useAuthStore((s) => s.status);

  return useMutation<unknown, Error, ReactPostVariables, MutationPostsContext>({
    mutationFn: async ({ postId, type }) => {
      if (status === "unauthenticated") {
        navigate("/login");
        throw new Error("Unauthorized");
      }

      return reactionsService.react(postId, type);
    },

    onMutate: async ({ postId, type }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previous = queryClient.getQueriesData<PostsQueryData>({
        queryKey: ["posts"],
      });

      const updatePost = (post: Post, type: ReactionType) => {
        const current = post.userReaction;

        let likes = post.likesCount;
        let dislikes = post.dislikesCount;

        let newReaction: ReactionType | null = type;

        if (current === type) {
          newReaction = null;

          if (type === "like") {
            likes--;
          } else {
            dislikes--;
          }
        } else {
          if (current === "like") likes--;
          if (current === "dislike") dislikes--;

          if (type === "like") {
            likes++;
          } else {
            dislikes++;
          }
        }

        return {
          ...post,
          userReaction: newReaction,
          likesCount: likes,
          dislikesCount: dislikes,
        };
      };

      queryClient.setQueriesData<PostsQueryData>(
        { queryKey: ["posts"] },
        (old: PostsQueryData | undefined) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.map((post) =>
              post.id === postId ? updatePost(post, type) : post,
            ),
          };
        },
      );

      queryClient.setQueryData<Post>(["post", postId], (old) => {
        if (!old) return old;
        return updatePost(old, type);
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (!context?.previous) return;

      context.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSettled: () => {},
  });
};
