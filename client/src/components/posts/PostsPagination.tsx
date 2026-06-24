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
    isFirstPage,
    isLastPage,
    error,
    nextPage,
    prevPage,
    hasNextPage,
    page,
  } = query;

  const status = useAuthStore((s) => s.status);

  if (isLoading || status === "loading") {
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

  const showPagination = !(isFirstPage && isLastPage);

  return (
    <Box>
      {children(items)}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: "center",
          my: 3,
          alignItems: "center",
        }}
      >
        {page !== undefined && showPagination && (
          <>
            {page - 1 > 0 && (
              <Button
                onClick={prevPage}
                disabled={!prevPage || page === 1}
                variant="contained"
                sx={{
                  minWidth: 48,
                  borderRadius: "10px",
                  fontWeight: 600,
                  opacity: 1,
                  cursor: "default",
                }}
              >
                {page && page - 1}
              </Button>
            )}

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

            {!isLastPage && (
              <Button
                onClick={nextPage}
                disabled={!hasNextPage}
                variant="contained"
                sx={{
                  minWidth: 48,
                  borderRadius: "10px",
                  fontWeight: 600,
                  opacity: 1,
                  cursor: "default",
                }}
              >
                {page && page + 1}
              </Button>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
