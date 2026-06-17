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

export type PostProps = {
  post: PostType;
};

export const Post = ({ post }: PostProps) => {
  const { user, title, text, image, likesCount, dislikesCount, commentsCount } =
    post;

  return (
    <Card
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        borderRadius: 0,
        px: 2,
        py: 2,
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
            to={`/user/${user.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
              {user.name}
            </Typography>
          </Link>

          <Typography variant="caption" color="text.secondary">
            @{user.username}
          </Typography>
        </Box>
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
