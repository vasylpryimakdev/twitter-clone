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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          <Typography sx={{ fontSize: 28, mb: 1 }}>💬</Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            No comments yet
          </Typography>

          <Typography variant="body2">
            Be the first to start the conversation.
          </Typography>
        </Box>
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
