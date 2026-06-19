import { Box, CircularProgress, Typography } from "@mui/material";
import { usePosts } from "../hooks/usePosts";
import { Post } from "../components/post/Post";

export const HomePage = () => {
  const { data, isLoading, error } = usePosts();

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

  if (data?.length === 0) {
    return <div>No Posts</div>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        py: 2,
      }}
    >
      {data?.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </Box>
  );
};
