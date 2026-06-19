import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        textAlign: "center",
        padding: 2,
      }}
    >
      <Typography variant="h3">Something went wrong</Typography>

      <Typography variant="body1" color="text.secondary">
        An unexpected error occurred. Please try again later.
      </Typography>

      <Button variant="contained" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </Box>
  );
};
