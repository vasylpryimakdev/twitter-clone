import { useState } from "react";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  IconButton,
  TextField,
  Button,
} from "@mui/material";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import { useUpdateReply, useDeleteReply } from "../../hooks/useReplies";
import type { Reply } from "../../types/reply.types";

type Props = {
  reply: Reply;
  commentId: string;
  isOwner?: boolean;
};

export const ReplyCard = ({ reply, commentId, isOwner = false }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(reply.text);

  const updateReply = useUpdateReply(commentId);
  const deleteReply = useDeleteReply(commentId);

  const handleSave = () => {
    if (!text.trim()) return;

    updateReply.mutate(
      { replyId: reply.id, text },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  const handleCancel = () => {
    setText(reply.text);
    setIsEditing(false);
  };

  return (
    <Stack direction="row" spacing={1.5} sx={{ pl: 6, py: 1 }}>
      <Avatar
        src={reply.author.avatar?.url}
        sx={{ width: 32, height: 32, mt: 0.5 }}
      />

      <Box sx={{ flex: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography sx={{ fontWeight: 600 }} variant="body2">
            {reply.author.name} {reply.author.surname}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            @{reply.author.username}
          </Typography>
        </Stack>

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
              <Button size="small" variant="contained" onClick={handleSave}>
                Save
              </Button>

              <Button size="small" onClick={handleCancel}>
                Cancel
              </Button>
            </Stack>
          </Box>
        )}

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <IconButton size="small">
            <ChatBubbleOutlineIcon fontSize="small" />
          </IconButton>

          {isOwner && (
            <Button
              size="small"
              color="error"
              onClick={() => deleteReply.mutate(reply.id)}
            >
              Delete
            </Button>
          )}
        </Stack>
      </Box>
    </Stack>
  );
};
