import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuthStore } from "../../stores/auth.store";

export const ProfileMeRedirect = () => {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const status = useAuthStore((s) => s.status);

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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={`/profile/${user.id}`} replace />;
};
