import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuthStore } from "../stores/auth.store";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { Navigate } from "react-router-dom";
import PostsList from "../components/post/PostsList";
import { useMyPosts } from "../hooks/usePosts";

export const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  const { data, isLoading } = useMyPosts();

  const userPosts = data?.pages.flatMap((page) => page.data) ?? [];

  if (!isInitialized || status === "loading") {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (!user) return null;

  return (
    <Box sx={{ width: "100%" }}>
      <ProfileHeader user={user} />

      <Box sx={{ mt: 3, px: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          My Posts
        </Typography>

        {isLoading && <CircularProgress />}

        {!isLoading && userPosts.length === 0 && (
          <Typography color="text.secondary">No posts yet</Typography>
        )}

        {!isLoading && userPosts.length > 0 && <PostsList posts={userPosts} />}
      </Box>
    </Box>
  );
};
