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

      <Box
        sx={{
          my: 3,
          px: 2,
          py: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "fit-content",
            position: "relative",

            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: "100%",
              height: 4,
              borderRadius: 999,
              bgcolor: "grey.400",
            },
          }}
        >
          {isOwner ? "My Posts" : `${user.name}'s Posts`}
        </Typography>

        <PaginationList query={query}>
          {(items) => <PostsList posts={items} />}
        </PaginationList>
      </Box>
    </Box>
  );
};
