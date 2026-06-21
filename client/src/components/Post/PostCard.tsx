import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  IconButton,
  Avatar,
  Box,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";

import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAlt from "@mui/icons-material/ThumbUpOffAlt";
import ChatBubbleOutlineOutlined from "@mui/icons-material/ChatBubbleOutlineOutlined";

import type { Post as PostType } from "../../types/post.types";
import { formatDate } from "../../shared/utils/formatDate";
import PostMenu from "./PostMenu";

import { useToastStore } from "../../stores/toast.store";
import { handleError } from "../../shared/errors/handleError";
import { useAuthStore } from "../../stores/auth.store";
import { useDeletePost } from "../../hooks/usePosts";

export type PostProps = {
  post: PostType;
};

export const Post = ({ post }: PostProps) => {
  const {
    id,
    title,
    text,
    imageUrl,
    authorId,
    author,
    likesCount,
    dislikesCount,
    commentsCount,
    createdAt,
  } = post;

  const user = useAuthStore((s) => s.user);
  const showToast = useToastStore((s) => s.showToast);

  const deletePost = useDeletePost();
  const handleDelete = (postId: string) => {
    deletePost.mutate(postId, {
      onSuccess: () => {
        showToast("Post deleted", "success");
      },
      onError: handleError,
    });
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        px: 2,
        py: 2,
        mb: 2,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        opacity: deletePost.isPending ? 0.6 : 1,
        filter: deletePost.isPending ? "grayscale(1)" : "none",
        transition: "0.2s ease",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 1.5,
        }}
      >
        <Link to={`/user/${authorId}`} style={{ display: "flex" }}>
          <Avatar src={author.avatar?.url} sx={{ width: 36, height: 36 }} />
        </Link>

        <Box>
          <Link
            to={`/profile/${authorId}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
              {author.name} {author.surname}
            </Typography>
          </Link>

          <Typography variant="caption" color="text.secondary">
            @{author.username}
          </Typography>
        </Box>

        <PostMenu
          postId={id}
          isOwner={authorId === user?.id}
          onDelete={handleDelete}
        />
      </Box>

      {imageUrl && (
        <CardMedia
          component="img"
          image={imageUrl}
          alt={title}
          sx={{
            borderRadius: 2,
            mb: 2,
            maxHeight: 400,
            objectFit: "cover",
          }}
        />
      )}

      <CardContent sx={{ p: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {text}
        </Typography>

        <Stack
          direction="row"
          spacing={3}
          sx={{ alignItems: "center", width: "100%" }}
        >
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <IconButton size="small">
              <ThumbUpOffAlt fontSize="small" />
            </IconButton>
            <Typography variant="caption">{likesCount}</Typography>
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <IconButton size="small">
              <ThumbDownOffAltIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption">{dislikesCount}</Typography>
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <IconButton size="small">
              <ChatBubbleOutlineOutlined fontSize="small" />
            </IconButton>
            <Typography variant="caption">{commentsCount}</Typography>
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ alignSelf: "end", textAlign: "end", ml: "auto", flex: 1 }}
          >
            {formatDate(createdAt)}
          </Typography>
        </Stack>
      </CardContent>

      {deletePost.isPending && (
        <CircularProgress
          size={42}
          thickness={5}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.9,
            zIndex: 2,
          }}
        />
      )}
    </Card>
  );
};
