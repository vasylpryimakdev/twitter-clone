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
import { useQueryClient } from "@tanstack/react-query";
import { commentsService } from "../../services/comments.service";

type Props = {
  postId: string;
};

export const CommentForm = ({ postId }: Props) => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || !user) return;

    try {
      setLoading(true);

      await commentsService.create(postId, { text });

      setText("");

      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
      <Avatar src={user?.avatar?.url} sx={{ width: 32, height: 32 }} />

      <Box sx={{ flex: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Box>

      <Button
        variant="contained"
        disabled={!text.trim() || loading}
        onClick={handleSubmit}
      >
        {loading ? <CircularProgress size={18} /> : "Post"}
      </Button>
    </Stack>
  );
};
