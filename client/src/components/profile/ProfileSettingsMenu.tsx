import {
  Menu,
  MenuItem,
  ListItemText,
  Divider,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { authService } from "../../services/auth.service";
import { auth } from "../../firebase/firebase";
import { useState } from "react";
import { useToastStore } from "../../stores/toast.store";

type Props = {
  anchorEl: HTMLElement | null;
  setAnchorEl: (value: HTMLElement | null) => void;
  onDeleteAccount: () => void;
  onChangePassword: () => void;
};

const ProfileSettingsMenu = ({
  anchorEl,
  setAnchorEl,
  onDeleteAccount,
  onChangePassword,
}: Props) => {
  const [sending, setSending] = useState(false);
  const showToast = useToastStore((s) => s.showToast);

  const user = auth.currentUser;

  const provider = user?.providerData[0]?.providerId;

  const isGoogle = provider === "google.com";
  const isEmailVerified = user?.emailVerified;

  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);

  const handleSendVerification = async () => {
    try {
      setSending(true);
      await authService.sendVerificationEmail();
      showToast("Verification email sent", "success");
    } catch {
      showToast("Failed to send verification email",'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <Menu
      disableScrollLock
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Tooltip
        title={
          isGoogle
            ? "You signed in with Google. Manage your password in Google Account"
            : ""
        }
        arrow
      >
        <span>
          <MenuItem
            onClick={() => {
              if (isGoogle) return;
              handleClose();
              onChangePassword();
            }}
            sx={{
              opacity: isGoogle ? 0.5 : 1,
              pointerEvents: isGoogle ? "none" : "auto",
            }}
          >
            <ListItemText>Change password</ListItemText>
          </MenuItem>
        </span>
      </Tooltip>

      {!isEmailVerified && (
        <MenuItem onClick={handleSendVerification} disabled={sending}>
          <ListItemText>
            {sending ? "Sending..." : "Send verification email"}
          </ListItemText>

          {sending && <CircularProgress size={16} sx={{ ml: 1 }} />}
        </MenuItem>
      )}

      {!isGoogle && !isEmailVerified && <Divider />}

      <MenuItem onClick={onDeleteAccount} sx={{ color: "error.main" }}>
        Delete account
      </MenuItem>
    </Menu>
  );
};

export default ProfileSettingsMenu;
