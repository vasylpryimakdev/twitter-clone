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
import { formatDate } from "../../shared/utils/formatDate";

type Props = {
  comment: Comment;
  postId: string;
  userId: string | undefined;
};

export const CommentCard = ({ comment, postId, userId }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.text);
  const [showReplies, setShowReplies] = useState(false);

  const isOwner = userId === comment.authorId;

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
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
        mb: 1,
        transition: "0.2s ease",
      }}
    >
      <Avatar
        src={comment.author?.avatar?.url}
        component="a"
        href={`/profile/${comment.author?.id}`}
        sx={{
          width: 40,
          height: 40,
          mt: 0.5,
          cursor: "pointer",
        }}
      />
      <Box sx={{ flex: 1, position: "relative" }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          {showReplies && (
            <Box
              sx={{
                position: "absolute",
                left: -33,
                top: 45,
                bottom: 0,
                width: "2px",
                backgroundColor: "divider",
              }}
            />
          )}

          <Stack
            component="a"
            href={`/profile/${comment.author?.id}`}
            direction="column"
            sx={{ mb: 2 }}
          >
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleSave();
                }
              }}
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
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1,
            color: "text.secondary",
          }}
        >
          <Stack direction="row" sx={{ alignItems: "center" }} spacing={0.5}>
            <IconButton size="small" onClick={toggleReplies}>
              <ChatBubbleOutlineIcon fontSize="small" />
            </IconButton>

            <Typography variant="caption">{comment.repliesCount}</Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: "flex-end", mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {formatDate(comment.createdAt)}
            </Typography>
          </Stack>
        </Stack>
        {showReplies && (
          <Box sx={{ mt: 1 }}>
            <RepliesList
              commentId={comment.id}
              postId={postId}
              userId={userId}
            />
          </Box>
        )}
      </Box>
    </Stack>
  );
};
