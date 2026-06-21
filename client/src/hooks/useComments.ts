import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import {
  commentsService,
  type CommentsResponse,
} from "../services/comments.service";
import { useQueryErrorHandler } from "./useQueryErrorHandler";

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
