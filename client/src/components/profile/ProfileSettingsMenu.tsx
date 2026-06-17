import { Menu, MenuItem, ListItemText, Divider } from "@mui/material";

type Props = {
  anchorEl: HTMLElement | null;
  setAnchorEl: (value: HTMLElement | null) => void;
};

const ProfileSettingsMenu = ({ anchorEl, setAnchorEl }: Props) => {
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);

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

      <MenuItem onClick={handleClose}>
        <ListItemText>Log out</ListItemText>
      </MenuItem>

      <MenuItem onClick={handleClose} sx={{ color: "error.main" }}>
        Delete account
      </MenuItem>
    </Menu>
  );
};

export default ProfileSettingsMenu;
