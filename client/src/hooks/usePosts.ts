import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

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

type Cursor = string | undefined;

const showToast = useToastStore.getState().showToast;

export const usePosts = () => {
  const initialized = useAuthStore((s) => s.isInitialized);
  const status = useAuthStore((s) => s.status);

  const query = useInfiniteQuery<PostsFeedResponse>({
    queryKey: ["posts", "feed"],
    enabled: initialized && status === "authenticated",
    queryFn: ({ pageParam }) =>
      postsService.getPosts({ cursor: pageParam as string | null }),

    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  useQueryErrorHandler(query.error, query.isError);

  return query;
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

export const useUserPosts = (userId?: string) => {
  const query = useInfiniteQuery<
    PostsFeedResponse,
    Error,
    InfiniteData<PostsFeedResponse>,
    [string, string, string | undefined],
    Cursor
  >({
    queryKey: ["posts", "user", userId],

    queryFn: ({ pageParam }) => postsService.getPostsByUser(userId!, pageParam),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,

    enabled: !!userId,
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

  return useMutation({
    mutationFn: ({
      postId,
      type,
    }: {
      postId: string;
      type: "like" | "dislike";
    }) => reactionsService.react(postId, type),

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

// export const useSearchPosts = (query: string) => {
//   return useQuery<Post[]>({
//     queryKey: ["posts", "search", query],
//     queryFn: () => postsService.searchPosts(query),
//     enabled: !!query,
//   });
// };
