// app/layout/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { Header } from "./Header";

export const MainLayout = () => {
  return (
    <Box>
      <Header />

      <Box component="main" sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
