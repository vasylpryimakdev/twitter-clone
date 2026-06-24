import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import { useComments } from "../../hooks/useComments";
import { CommentCard } from "./CommentCard";
import { CommentForm } from "./CommentForm";
import { useAuthStore } from "../../stores/auth.store";

type Props = {
  postId: string;
};

const CommentsList = ({ postId }: Props) => {
  const { comments, isLoading, error } = useComments(postId);
  const user = useAuthStore((s) => s.user);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={22} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography
        color="error"
        variant="body2"
        sx={{ textAlign: "center", py: 2 }}
      >
        Failed to load comments. Please try again.
      </Typography>
    );
  }

  return (
    <Stack spacing={4}>
      <CommentForm postId={postId} />

      {comments.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 2 }}
        >
          No comments yet. Be the first to share your thoughts 💬
        </Typography>
      ) : (
        comments.map((comment) => (
          <CommentCard
            key={comment.id}
            postId={postId}
            comment={comment}
            userId={user?.id}
          />
        ))
      )}
    </Stack>
  );
};

export default CommentsList;
