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

import { authService } from "../../services/auth.service";
import { useToastStore } from "../../stores/toast.store";
import { handleError } from "../../shared/errors/handleError";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const ChangePasswordModal = ({ open, onClose }: Props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const showToast = useToastStore((s) => s.showToast);

  const resetState = () => {
    setOldPassword("");
    setNewPassword("");
  };

  const handleClose = () => {
    if (loading) return;
    resetState();
    onClose();
  };

  const handleSuccess = () => {
    showToast("Password updated successfully", "success");
    resetState();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) return;

    setLoading(true);

    try {
      await authService.changePassword(oldPassword, newPassword);
      handleSuccess();
    } catch (err) {
      handleError(err);
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

          <Button
            type="submit"
            variant="contained"
            disabled={loading || !oldPassword || !newPassword}
          >
            {loading ? "Changing..." : "Change"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
