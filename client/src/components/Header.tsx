import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Avatar,
  Button,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useAuthStore } from "../stores/auth.store";

export const Header = () => {
  const user = useAuthStore((state) => state.user);

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
          <Link
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
          </Link>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {user ? (
            <IconButton component={Link} to={`/user/${user.id}`}>
              <Avatar src={user.avatar} sx={{ width: 34, height: 34 }} />
            </IconButton>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button component={Link} to="/login" variant="text">
                Login
              </Button>

              <Button component={Link} to="/signup" variant="contained">
                Sign Up
              </Button>
            </Stack>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
