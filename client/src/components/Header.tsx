import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";

export const Header = () => {
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
              Twitter
            </Typography>
          </Link>
        </Box>

        {/* RIGHT - PROFILE */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton component={Link} to="/profile">
            <Avatar
              src="https://i.pravatar.cc/150?img=12"
              sx={{ width: 34, height: 34 }}
            />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
