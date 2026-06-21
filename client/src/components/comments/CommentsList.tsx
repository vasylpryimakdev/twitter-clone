import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import { useComments } from "../../hooks/useComments";
import { CommentCard } from "./Comment";
import { CommentForm } from "./CommentForm";

type Props = {
  postId: string;
};

const CommentsList = ({ postId }: Props) => {
  const { comments, isLoading, error } = useComments(postId);

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

  return (
    <Stack spacing={1}>
      <CommentForm postId={postId} />

      {!comments ||
        (!comments.length && (
          <Typography variant="body2" color="text.secondary">
            No comments yet
          </Typography>
        ))}

      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </Stack>
  );
};

export default CommentsList;
