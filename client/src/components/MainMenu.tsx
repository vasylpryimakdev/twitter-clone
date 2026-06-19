import { Menu, MenuItem, ListItemIcon } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { authService } from "../services/auth.service";

type Props = {
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClose: () => void;
};

const MainMenu = ({ anchorEl, open, handleClose }: Props) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      disableScrollLock
    >
      <MenuItem component={Link} to="/" onClick={handleClose}>
        <ListItemIcon>
          <HomeIcon fontSize="small" />
        </ListItemIcon>
        Home
      </MenuItem>

      <MenuItem component={Link} to="/profile" onClick={handleClose}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        Profile
      </MenuItem>

      <MenuItem component={Link} to="/create-post" onClick={handleClose}>
        <ListItemIcon>
          <AddIcon fontSize="small" />
        </ListItemIcon>
        Create post
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleClose();
          authService.logout();
        }}
      >
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
};

export default MainMenu;
