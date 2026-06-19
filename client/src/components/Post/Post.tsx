import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  IconButton,
  Avatar,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAlt from "@mui/icons-material/ThumbUpOffAlt";
import ChatBubbleOutlineOutlined from "@mui/icons-material/ChatBubbleOutlineOutlined";

import type { Post as PostType } from "../../types/post.types";
import { formatDate } from "../../shared/utils/formatDate";

export type PostProps = {
  post: PostType;
};

export const Post = ({ post }: PostProps) => {
  const {
    title,
    text,
    image,
    likesCount,
    dislikesCount,
    commentsCount,
    createdAt,
  } = post;

  const user = {
    id: 1,
    avatar: "https://i.pravatar.cc/150?img=45",
    name: "Name",
    surname: "Surname",
    username: "username",
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
        <Link to={`/user/${user.id}`} style={{ display: "flex" }}>
          <Avatar src={user.avatar} sx={{ width: 36, height: 36 }} />
        </Link>

        <Box>
          <Link
            to={`/user/${1}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
              {user.name} {user.surname}
            </Typography>
          </Link>

          <Typography variant="caption" color="text.secondary">
            @{user.username}
          </Typography>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ alignSelf: "start", ml: "auto" }}
        >
          {formatDate(createdAt)}
        </Typography>
      </Box>

      {image && (
        <CardMedia
          component="img"
          image={image}
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

        <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
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
        </Stack>
      </CardContent>
    </Card>
  );
};
