import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { Header } from "./header/Header";

export const MainLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          maxWidth: 900,
          width: "100%",
          mx: "auto",
          flex: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
