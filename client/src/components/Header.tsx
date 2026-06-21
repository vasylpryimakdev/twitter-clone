import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Avatar,
  Button,
  Stack,
  Skeleton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useAuthStore } from "../stores/auth.store";
import { useState } from "react";
import MainMenu from "./MainMenu";
import { useUser } from "../hooks/useUser";

export const Header = () => {
  const status = useAuthStore((state) => state.status);
  const authUser = useAuthStore((state) => state.user);

  const userId = authUser?.id;

  const { data: user } = useUser(userId);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid #e6ecf0",
        color: "black",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: 60,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <RouterLink
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <TwitterIcon sx={{ fontSize: 30, color: "#1DA1F2" }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, ml: 1, color: "#1DA1F2" }}
            >
              TwitterClone
            </Typography>
          </RouterLink>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {status === "loading" && (
            <IconButton>
              <Skeleton variant="circular" width={34} height={34} />
            </IconButton>
          )}
          {status === "unauthenticated" && (
            <Stack direction="row" spacing={1}>
              <Button component={RouterLink} to="/login" variant="text">
                Login
              </Button>

              <Button component={RouterLink} to="/signup" variant="contained">
                Sign Up
              </Button>
            </Stack>
          )}
          {status === "authenticated" && user && (
            <IconButton onClick={handleOpenMenu}>
              <Avatar
                src={user.avatar?.url || undefined}
                slotProps={{
                  img: {
                    referrerPolicy: "no-referrer",
                  },
                }}
                sx={{ width: 34, height: 34 }}
              />
            </IconButton>
          )}

          <MainMenu
            handleClose={handleCloseMenu}
            anchorEl={anchorEl}
            open={open}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
