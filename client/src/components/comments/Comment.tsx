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
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import type { Comment } from "../../types/comment.types";

import { useUpdateComment, useDeleteComment } from "../../hooks/useComments";
import { RepliesList } from "../replies/RepliesList";

type Props = {
  comment: Comment;
  postId: string;
  isOwner?: boolean;
};

export const CommentCard = ({ comment, postId, isOwner = false }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.text);
  const [showReplies, setShowReplies] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const updateComment = useUpdateComment(postId);
  const deleteComment = useDeleteComment(postId);

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
    setText(comment.text);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!text.trim()) return;

    updateComment.mutate(
      {
        commentId: comment.id,
        text,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleDelete = () => {
    deleteComment.mutate(comment.id);
    handleMenuClose();
  };

  const toggleReplies = () => {
    setShowReplies((prev) => !prev);
  };

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: "1px solid #e6ecf0",
      }}
    >
      <Avatar
        src={comment.author?.avatar?.url}
        sx={{ width: 40, height: 40, mt: 0.5 }}
      />

      <Box sx={{ flex: 1 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography sx={{ fontWeight: 600 }} variant="body2">
              {comment.author?.name ?? "Unknown"}{" "}
              {comment.author?.surname ?? ""}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              @{comment.author?.username ?? "user"}
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
                <MenuItem onClick={handleEdit}>Edit</MenuItem>

                <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                  Delete
                </MenuItem>
              </Menu>
            </>
          )}
        </Stack>

        {!isEditing ? (
          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {comment.text}
          </Typography>
        ) : (
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            sx={{ mt: 1 }}
          >
            <TextField
              fullWidth
              size="small"
              multiline
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{
                "& textarea": {
                  resize: "none",
                },
              }}
            />

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button type="submit" size="small" variant="contained">
                Save
              </Button>

              <Button type="button" size="small" onClick={handleCancel}>
                Cancel
              </Button>
            </Stack>
          </Box>
        )}

        <Stack
          direction="row"
          spacing={3}
          sx={{ mt: 1, color: "text.secondary" }}
        >
          <Stack direction="row" sx={{ alignItems: "center" }} spacing={0.5}>
            <IconButton size="small" onClick={toggleReplies}>
              <ChatBubbleOutlineIcon fontSize="small" />
            </IconButton>

            <Typography variant="caption">{comment.repliesCount}</Typography>
          </Stack>
        </Stack>
        {showReplies && (
          <Box sx={{ mt: 1 }}>
            <RepliesList commentId={comment.id} />
          </Box>
        )}
      </Box>
    </Stack>
  );
};
