import {
  Box,
  Avatar,
  Typography,
  Stack,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../stores/auth.store";

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
    <Box>
      <Box
        sx={{
          height: 180,
          backgroundColor: "#cfd9de",
        }}
      />

      <Box sx={{ px: 3, mt: -6 }}>
        <Stack direction="row" sx={{ alignItems: "flex-end" }} spacing={2}>
          <Avatar
            src={user.avatar}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid white",
            }}
          />

          <Box>
            <Typography variant="h5" sx={{ fontWeight: "flex-end" }}>
              {user.name} {user.surname}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
          <Typography variant="body2">
            <b>120</b> Posts
          </Typography>

          <Typography variant="body2">
            <b>340</b> Followers
          </Typography>

          <Typography variant="body2">
            <b>180</b> Following
          </Typography>
        </Stack>
      </Box>

      {/* TABS */}
      <Box sx={{ mt: 3 }}>
        <Paper elevation={0}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
            <Tab label="Posts" />
            <Tab label="Replies" />
          </Tabs>
        </Paper>

        {/* CONTENT */}
        <Box sx={{ p: 2 }}>
          {tab === 0 && <Typography>Here will be user posts...</Typography>}

          {tab === 1 && <Typography>Here will be replies...</Typography>}
        </Box>
      </Box>
    </Box>
  );
};
