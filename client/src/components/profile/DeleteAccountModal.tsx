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
import { GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase/firebase";
import { authService } from "../../services/auth.service";
import { handleError } from "../../shared/errors/handleError";
import { useToastStore } from "../../stores/toast.store";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const DeleteAccountModal = ({ open, onClose }: Props) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useToastStore((s) => s.showToast);

  const navigate = useNavigate();

  const user = auth.currentUser;
  const provider = user?.providerData[0]?.providerId;

  const isGoogle = provider === "google.com";
  const isPassword = provider === "password";

  const resetState = () => {
    setPassword("");
  };

  const closeModal = () => {
    if (loading) return;
    resetState();
    onClose();
  };

  const handleDeleteSuccess = () => {
    resetState();
    onClose();
    navigate("/");
    showToast("User was deleted successfully!");
  };

  const handlePasswordDelete = async () => {
    if (!password) return;

    setLoading(true);

    try {
      await authService.deleteAccount(password);
      handleDeleteSuccess();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDelete = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      await reauthenticateWithPopup(user, provider);
      await authService.deleteAccount();

      handleDeleteSuccess();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (isPassword) {
      handlePasswordDelete();
      return;
    }

    if (isGoogle) {
      handleGoogleDelete();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : closeModal}
      maxWidth="xs"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Delete account</DialogTitle>

        <DialogContent>
          <DialogContentText>
            This action is permanent. Please confirm your identity.
          </DialogContentText>

          {isPassword && (
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mt: 2 }}
              disabled={loading}
            />
          )}

          {isGoogle && (
            <DialogContentText sx={{ mt: 2 }}>
              You are signed in with Google. We will re-authenticate with Google
              before deleting your account.
            </DialogContentText>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal} disabled={loading}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={loading || (isPassword && !password)}
          >
            Delete
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
