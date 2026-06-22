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

import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAlt from "@mui/icons-material/ThumbUpOffAlt";
import ChatBubbleOutlineOutlined from "@mui/icons-material/ChatBubbleOutlineOutlined";

import type { Post as PostType } from "../../types/post.types";
import { formatDate } from "../../shared/utils/formatDate";
import PostMenu from "./PostMenu";

import { useToastStore } from "../../stores/toast.store";
import { handleError } from "../../shared/errors/handleError";
import { useAuthStore } from "../../stores/auth.store";
import { useDeletePost, useReactPost } from "../../hooks/usePosts";
import { useState } from "react";
import CommentsList from "../comments/CommentsList";
import { useNavigate } from "react-router-dom";

export type PostProps = {
  post: PostType;
};

export const PostCard = ({ post }: PostProps) => {
  const {
    id,
    title,
    text,
    image,
    authorId,
    author,
    likesCount,
    dislikesCount,
    commentsCount,
    createdAt,
    userReaction,
  } = post;

  const [showComments, setShowComments] = useState(false);

  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const showToast = useToastStore((s) => s.showToast);

  const deletePost = useDeletePost();
  const reactPost = useReactPost();

  const handleDelete = (postId: string) => {
    deletePost.mutate(postId, {
      onSuccess: () => {
        showToast("Post deleted", "success");
      },
      onError: handleError,
    });
  };

  const handleLike = () => {
    if (status === "unauthenticated") {
      navigate("/login");

      return;
    }

    reactPost.mutate({
      postId: id,
      type: "like",
    });
  };

  const handleDislike = () => {
    if (status === "unauthenticated") {
      navigate("/login");

      return;
    }

    reactPost.mutate({
      postId: id,
      type: "dislike",
    });
  };

  const isLiked = userReaction === "like";
  const isDisliked = userReaction === "dislike";

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
        <Avatar
          component="a"
          href={`/profile/${authorId}`}
          src={author.avatar?.url}
          sx={{ width: 36, height: 36 }}
        />

        <Box component="a" href={`/profile/${authorId}`}>
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
            {author.name} {author.surname}
          </Typography>

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

      {image && (
        <CardMedia
          component="img"
          image={image.url}
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
            <IconButton
              size="small"
              disabled={reactPost.isPending}
              onClick={handleLike}
              sx={{
                color: isLiked ? "primary.main" : "inherit",

                "&.Mui-disabled": {
                  color: isLiked ? "primary.main" : "inherit",
                  opacity: 1,
                },
              }}
            >
              <ThumbUpOffAlt fontSize="small" />
            </IconButton>
            <Typography variant="caption">{likesCount}</Typography>
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <IconButton
              size="small"
              disabled={reactPost.isPending}
              onClick={handleDislike}
              sx={{
                color: isDisliked ? "error.main" : "text.primary",

                "&.Mui-disabled": {
                  color: isDisliked ? "error.main" : "text.primary",
                  opacity: 1,
                },
              }}
            >
              <ThumbDownOffAltIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption">{dislikesCount}</Typography>
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <IconButton
              size="small"
              onClick={() => setShowComments((prev) => !prev)}
            >
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

        {showComments && (
          <Box sx={{ mt: 2 }}>
            <CommentsList postId={id} />
          </Box>
        )}
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
