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

import { useCreateComment } from "../../hooks/useComments";

type Props = {
  postId: string;
};

export const CommentForm = ({ postId }: Props) => {
  const user = useAuthStore((s) => s.user);

  const [text, setText] = useState("");

  const createComment = useCreateComment(postId);
  const loading = createComment.isPending;

  const handleSubmit = () => {
    if (!text.trim()) return;

    createComment.mutate(text, {
      onSuccess: () => setText(""),
    });
  };

  return (
    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
      <Avatar src={user?.avatar?.url} sx={{ width: 32, height: 32 }} />

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
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Box>

      <Button
        type="submit"
        form=""
        variant="contained"
        disabled={!text.trim() || loading}
        onClick={handleSubmit}
      >
        {loading ? <CircularProgress size={18} /> : "Post"}
      </Button>
    </Stack>
  );
};
