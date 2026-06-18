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
import { authService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const DeleteAccountModal = ({ open, onClose }: Props) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const user = auth.currentUser;
  const provider = user?.providerData[0]?.providerId;

  const isGoogle = provider === "google.com";
  const isPassword = provider === "password";

  const handleClose = () => {
    if (loading) return;

    setPassword("");
    onClose();
  };

  const handlePasswordDelete = async () => {
    setLoading(true);

    try {
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

  const handleGoogleDelete = async () => {
    setLoading(true);

    try {
      if (!user) return;

      const provider = new GoogleAuthProvider();

      await reauthenticateWithPopup(user, provider);

      await authService.deleteAccount();

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

    if (loading) return;

    if (isPassword) {
      if (!password) return;
      handlePasswordDelete();
    }

    if (isGoogle) {
      handleGoogleDelete();
    }
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
              You are signed in with Google. Click delete to continue with
              Google authentication.
            </DialogContentText>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="error"
            loading={loading}
            disabled={isPassword && !password}
          >
            Delete
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
