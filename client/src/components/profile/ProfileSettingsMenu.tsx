import { Menu, MenuItem, ListItemText, Divider } from "@mui/material";
import { authService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";

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
  const user = auth.currentUser;

  const provider = user?.providerData[0]?.providerId;

  const isGoogle = provider === "google.com";
  const isEmailVerified = user?.emailVerified;

  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    authService.logout();
    navigate("/", { replace: true });
  };

  return (
    <Menu
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
      {!isGoogle && (
        <MenuItem
          onClick={() => {
            handleClose();
            onChangePassword();
          }}
        >
          <ListItemText>Change password</ListItemText>
        </MenuItem>
      )}

      {!isEmailVerified && (
        <MenuItem onClick={authService.sendVerificationEmail}>
          <ListItemText>Send verification email</ListItemText>
        </MenuItem>
      )}

      {!isGoogle && !isEmailVerified && <Divider />}

      <MenuItem onClick={handleLogout}>
        <ListItemText>Log out</ListItemText>
      </MenuItem>

      <MenuItem onClick={onDeleteAccount} sx={{ color: "error.main" }}>
        Delete account
      </MenuItem>
    </Menu>
  );
};

export default ProfileSettingsMenu;
