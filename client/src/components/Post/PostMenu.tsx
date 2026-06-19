import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  postId: string;
  isOwner: boolean;
  onDelete: (postId: string) => void;
};

const PostMenu = ({ postId, isOwner, onDelete }: Props) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!isOwner) return null;

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ ml: "auto" }}>
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: -1,
              ml: 1.5,
              minWidth: 120,
              borderRadius: 2,
              boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            navigate(`/posts/edit/${postId}`);
          }}
        >
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            onDelete(postId);
          }}
          sx={{ color: "error.main" }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default PostMenu;
