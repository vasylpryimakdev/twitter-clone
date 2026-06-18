import { Snackbar, Alert } from "@mui/material";
import { useToastStore } from "../stores/toast.store.ts";

export const Toast = () => {
  const { open, message, type, hideToast } = useToastStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={hideToast}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={type} onClose={hideToast}>
        {message}
      </Alert>
    </Snackbar>
  );
};
