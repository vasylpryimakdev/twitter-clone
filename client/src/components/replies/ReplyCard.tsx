import { useState } from "react";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  IconButton,
  TextField,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { useUpdateReply, useDeleteReply } from "../../hooks/useReplies";
import type { Reply } from "../../types/reply.types";

type Props = {
  reply: Reply;
  commentId: string;
  postId: string;
  isOwner?: boolean;
};

export const ReplyCard = ({
  reply,
  commentId,
  postId,
  isOwner = false,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(reply.text);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const updateReply = useUpdateReply(commentId);
  const deleteReply = useDeleteReply(postId, commentId);

  const isUpdating = updateReply.isPending;
  const isDeleting = deleteReply.isPending;

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleCancel = () => {
    setText(reply.text);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!text.trim()) return;

    updateReply.mutate(
      { replyId: reply.id, text },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  const handleDelete = () => {
    deleteReply.mutate(reply.id);
    handleMenuClose();
  };

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        pl: 6,
        py: 1,
        opacity: isDeleting ? 0.5 : 1,
        transition: "0.2s",
      }}
    >
      <Avatar
        src={reply.author.avatar?.url}
        sx={{ width: 32, height: 32, mt: 0.5 }}
      />

      <Box sx={{ flex: 1 }}>
        {/* HEADER */}
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography sx={{ fontWeight: 600 }} variant="body2">
              {reply.author.name} {reply.author.surname}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              @{reply.author.username}
            </Typography>
          </Stack>

          {isOwner && !isEditing && (
            <>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreHorizIcon fontSize="small" />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                disableScrollLock
                slotProps={{
                  paper: {
                    sx: {
                      minWidth: 120,
                      borderRadius: 2,
                      boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
                    },
                  },
                }}
              >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>

                <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </MenuItem>
              </Menu>
            </>
          )}
        </Stack>

        {/* BODY */}
        {!isEditing ? (
          <Typography sx={{ mt: 0.5 }}>{reply.text}</Typography>
        ) : (
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              multiline
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button
                size="small"
                variant="contained"
                onClick={handleSave}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save"}
              </Button>

              <Button size="small" onClick={handleCancel}>
                Cancel
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Stack>
  );
};
