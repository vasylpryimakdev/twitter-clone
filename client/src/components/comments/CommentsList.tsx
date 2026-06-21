import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import { useComments } from "../../hooks/useComments";
import { CommentCard } from "./Comment";

type Props = {
  postId: string;
};

const CommentsList = ({ postId }: Props) => {
  const { data, isLoading, error } = useComments(postId);

  const comments = data ?? [];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={22} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="body2">
        Failed to load comments
      </Typography>
    );
  }

  if (!comments.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No comments yet
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          author={comment.author}
        />
      ))}
    </Stack>
  );
};

export default CommentsList;
