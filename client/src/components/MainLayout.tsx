import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { Header } from "./Header";

export const MainLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
      }}
    >
      <Header />

      <Box component="main" sx={{ maxWidth: 900, mx: "auto" }}>
        <Outlet />
      </Box>
    </Box>
  );
};
