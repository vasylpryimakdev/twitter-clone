import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { authService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const DeleteAccountModal = ({ open, onClose }: Props) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClose = () => {
    if (loading) return;

    setPassword("");
    onClose();
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      await authService.deleteAccount(password);

      setPassword("");
      onClose();
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || loading) return;

    handleDelete();
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      maxWidth="xs"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Delete account</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Enter your password to permanently delete your account.
          </DialogContentText>

          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mt: 2 }}
            disabled={loading}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            color="error"
            loading={loading}
            disabled={!password}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
