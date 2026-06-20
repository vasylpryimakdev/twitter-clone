import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import {
  postsService,
  type PostsFeedResponse,
} from "../services/posts.service";
import type { PostDTO, Post } from "../types/post.types";
import { useToastStore } from "../stores/toast.store";
import { handleError } from "../shared/errors/handleError";
import { useNavigate } from "react-router-dom";
import { useQueryErrorHandler } from "./useQueryErrorHandler";

type Cursor = string | undefined;

const showToast = useToastStore.getState().showToast;

export const usePosts = () => {
  const query = useInfiniteQuery<PostsFeedResponse>({
    queryKey: ["posts", "feed"],
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

export const useMyPosts = () => {
  const query = useInfiniteQuery<
    PostsFeedResponse,
    Error,
    InfiniteData<PostsFeedResponse>,
    [string, string],
    Cursor
  >({
    queryKey: ["posts", "me"],

    queryFn: ({ pageParam }) => postsService.getMyPosts(pageParam),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
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

// export const useSearchPosts = (query: string) => {
//   return useQuery<Post[]>({
//     queryKey: ["posts", "search", query],
//     queryFn: () => postsService.searchPosts(query),
//     enabled: !!query,
//   });
// };
