import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { ProfileHeader } from "../components/profile/ProfileHeader";

export const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);

  const [tab, setTab] = useState(0);

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: 900 }}>
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
