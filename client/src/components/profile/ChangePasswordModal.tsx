import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  DialogContentText,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { authService } from "../../services/auth.service";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const ChangePasswordModal = ({ open, onClose }: Props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (loading) return;

    setOldPassword("");
    setNewPassword("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) return;

    try {
      setLoading(true);

      await authService.changePassword(oldPassword, newPassword);

      setOldPassword("");
      setNewPassword("");
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Change password</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Enter your current password and new password.
          </DialogContentText>

          <TextField
            fullWidth
            type="password"
            label="Current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{ mt: 2 }}
            disabled={loading}
          />

          <TextField
            fullWidth
            type="password"
            label="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
            loading={loading}
            disabled={!oldPassword || !newPassword}
          >
            Change
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
