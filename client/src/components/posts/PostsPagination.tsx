import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useAuthStore } from "../../stores/auth.store";
import type { ReactNode } from "react";

type PaginationQuery<T> = {
  items: T[];
  isLoading: boolean;
  isFetching: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
  error: unknown;
  page?: number;
  nextPage?: () => void;
  prevPage?: () => void;
  hasNextPage?: boolean;
};

type Props<T> = {
  children: (items: T[]) => ReactNode;
  query: PaginationQuery<T>;
};

export const PaginationList = <T,>({ children, query }: Props<T>) => {
  const {
    items,
    isLoading,
    isFetching,
    isFirstPage,
    isLastPage,
    error,
    nextPage,
    prevPage,
    hasNextPage,
    page,
  } = query;

  const status = useAuthStore((s) => s.status);

  if (isLoading || isFetching || status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography>Error loading</Typography>;
  }

  if (!items.length) {
    return <Typography>No Posts</Typography>;
  }

  const shouldShowPagination = Boolean(
    nextPage || prevPage || Number(page) > 1,
  );

  return (
    <Box>
      {children(items)}
      {shouldShowPagination && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "center",
            my: 3,
            alignItems: "center",
          }}
        >
          {!isFirstPage && (
            <Button
              onClick={prevPage}
              disabled={!prevPage || page === 1}
              variant="outlined"
              sx={{
                minWidth: 40,
                borderRadius: "10px",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              ‹
            </Button>
          )}

          {page !== undefined && (
            <Button
              disabled
              variant="contained"
              sx={{
                minWidth: 48,
                borderRadius: "10px",
                fontWeight: 600,
                opacity: 1,
                cursor: "default",
              }}
            >
              {page}
            </Button>
          )}

          {!isLastPage && (
            <Button
              onClick={nextPage}
              disabled={!hasNextPage}
              variant="outlined"
              sx={{
                minWidth: 40,
                borderRadius: "10px",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              ›
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
};
