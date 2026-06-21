import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useReplies } from "../../hooks/useReplies";
import { ReplyCard } from "./ReplyCard";
import { ReplyForm } from "./ReplyForm";

type Props = {
  commentId: string;
  userId: string | undefined;
  postId: string;
};

export const RepliesList = ({ commentId, userId, postId }: Props) => {
  const { data = [], isLoading, error } = useReplies(commentId);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
        <CircularProgress size={18} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="caption">
        Failed to load replies
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      <ReplyForm commentId={commentId} postId={postId} />

      {!data.length && (
        <Typography variant="caption" color="text.secondary" sx={{ pl: 6 }}>
          No replies yet
        </Typography>
      )}

      {data.map((reply) => (
        <ReplyCard
          key={reply.id}
          reply={reply}
          commentId={commentId}
          postId={postId}
          isOwner={userId === reply.authorId}
        />
      ))}
    </Stack>
  );
};
