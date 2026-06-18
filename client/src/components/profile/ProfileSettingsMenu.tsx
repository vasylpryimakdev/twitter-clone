import { Menu, MenuItem, ListItemText, Divider } from "@mui/material";
import { authService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

type Props = {
  anchorEl: HTMLElement | null;
  setAnchorEl: (value: HTMLElement | null) => void;
  onDeleteAccount: () => void;
};

const ProfileSettingsMenu = ({
  anchorEl,
  setAnchorEl,
  onDeleteAccount,
}: Props) => {
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
      <MenuItem onClick={handleClose}>
        <ListItemText>Change password</ListItemText>
      </MenuItem>

      <MenuItem onClick={handleClose}>
        <ListItemText>Verify email</ListItemText>
      </MenuItem>

      <Divider />

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
