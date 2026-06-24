import type { InfiniteData } from "@tanstack/react-query";


export const updateInfinitePages = <TItem, TPage extends { data: TItem[] }>(
  old: InfiniteData<TPage> | undefined,
  updater: (item: TItem) => TItem,
  matcher: (item: TItem) => boolean,
): InfiniteData<TPage> | undefined => {
  if (!old?.pages) return old;

  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      data: page.data.map((item) => (matcher(item) ? updater(item) : item)),
    })),
  };
};

export const removeFromInfinitePages = <TItem, TPage extends { data: TItem[] }>(
  old: InfiniteData<TPage> | undefined,
  matcher: (item: TItem) => boolean,
): InfiniteData<TPage> | undefined => {
  if (!old?.pages) return old;

  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      data: page.data.filter((item) => !matcher(item)),
    })),
  };
};
