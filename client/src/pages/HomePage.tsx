import { Box, CircularProgress, Typography } from "@mui/material";
import { usePosts } from "../hooks/usePosts";
import PostsList from "../components/posts/PostsList";

export const HomePage = () => {
  const { data, isLoading, error } = usePosts();

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography>Error loading posts</Typography>;
  }

  if (posts.length === 0) {
    return <Typography>No Posts</Typography>;
  }

  return <PostsList posts={posts} />;
};
