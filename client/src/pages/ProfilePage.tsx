import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { Navigate } from "react-router-dom";

export const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);

  const [tab, setTab] = useState(0);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (status === "loading") {
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

  return (
    <Box sx={{ width: "100%" }}>
      <ProfileHeader user={user} />
      <Box sx={{ mt: 3 }}>
        <Paper elevation={0}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
            <Tab label="Posts" />
            <Tab label="Replies" />
          </Tabs>
        </Paper>

        <Box sx={{ p: 2 }}>
          {tab === 0 && <Typography>Here will be user posts...</Typography>}

          {tab === 1 && <Typography>Here will be replies...</Typography>}
        </Box>
      </Box>
    </Box>
  );
};
