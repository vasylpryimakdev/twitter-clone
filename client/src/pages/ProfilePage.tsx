import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { useUser } from "../hooks/useUser";
import { PaginationList } from "../components/posts/PostsPagination";
import PostsList from "../components/posts/PostsList";
import { usePosts } from "../hooks/usePosts";

export const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();

  const authUser = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  const { data: user, isLoading: isUserLoading } = useUser(userId);

  const query = usePosts({ userId });

  const isOwner = authUser?.id === userId;

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

  if (isUserLoading) {
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

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>User not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <ProfileHeader
        user={user}
        emailVerified={authUser?.emailVerified}
        isOwner={isOwner}
      />

      <Box sx={{ mt: 3, px: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          My Posts
        </Typography>

        <PaginationList query={query}>
          {(items) => <PostsList posts={items} />}
        </PaginationList>
      </Box>
    </Box>
  );
};
