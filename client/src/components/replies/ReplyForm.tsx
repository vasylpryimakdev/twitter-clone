import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";

import { useAuthStore } from "../../stores/auth.store";
import { useCreateReply } from "../../hooks/useReplies";

type Props = {
  commentId: string;
  postId: string;
};

export const ReplyForm = ({ commentId, postId }: Props) => {
  const user = useAuthStore((s) => s.user);

  const [text, setText] = useState("");

  const createReply = useCreateReply(postId, commentId);
  const loading = createReply.isPending;

  const handleSubmit = () => {
    if (!text.trim()) return;

    createReply.mutate(text, {
      onSuccess: () => setText(""),
    });
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ mb: 1, pl: 6, alignItems: "center" }}
    >
      <Avatar src={user?.avatar?.url} sx={{ width: 28, height: 28, mt: 0.5 }} />

      <Box
        component="form"
        sx={{ flex: 1 }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Write a reply..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        disabled={!text.trim() || loading}
        onClick={handleSubmit}
      >
        {loading ? <CircularProgress size={18} /> : "Reply"}
      </Button>
    </Stack>
  );
};
