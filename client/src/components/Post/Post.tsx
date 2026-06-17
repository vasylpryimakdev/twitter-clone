import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ChatBubbleOutlineOutlined from "@mui/icons-material/ChatBubbleOutlineOutlined";
import type { Post as PostType } from "./post.types";

export type PostProps = {
  post: PostType;
};

export const Post = ({ post }: PostProps) => {
  const { title, text, image, likesCount, dislikesCount, commentsCount } = post;

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
      {/* IMAGE */}
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
        {/* TITLE */}
        <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
          {title}
        </Typography>

        {/* TEXT */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {text}
        </Typography>

        {/* ACTIONS */}
        <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
          {/* likes */}
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <IconButton size="small">
              <FavoriteBorderIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption">{likesCount}</Typography>
          </Stack>

          {/* dislikes */}
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <IconButton size="small">
              <ThumbDownOffAltIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption">{dislikesCount}</Typography>
          </Stack>

          {/* comments */}
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
