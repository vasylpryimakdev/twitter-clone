import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
  onReset?: () => void;
};

export const ErrorPage = ({ onReset }: Props) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    onReset?.();
    navigate("/");
  };

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

      <Button variant="contained" onClick={handleGoHome}>
        Go to Home
      </Button>
    </Box>
  );
};
