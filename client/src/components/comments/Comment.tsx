import { Avatar, Box, Stack, Typography, IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import type { Comment } from "../../types/comment.types";
import type { Author } from "../../types/user.types";

type Props = {
  comment: Comment;
  author?: Author;
  isOwner?: boolean;
  onReply?: () => void;
  onLike?: () => void;
};

export const CommentCard = ({
  comment,
  author,
  isOwner = false,
  onReply,
  onLike,
}: Props) => {
  console.log(isOwner);

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: "1px solid #e6ecf0",
        "&:hover": { backgroundColor: "#f7f9f9" },
      }}
    >
      <Avatar
        src={author?.avatar?.url}
        sx={{ width: 40, height: 40, mt: 0.5 }}
      />

      <Box sx={{ flex: 1 }}>
        <Stack
          sx={{ justifyContent: "space-between", alignItems: "center" }}
          direction="row"
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography sx={{ fontWeight: 600 }} variant="body2">
              {author?.name ?? "Unknown"} {author?.surname ?? ""}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              @{author?.username ?? "user"}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              ·
            </Typography>

            <Typography variant="caption" color="text.secondary">
              just now
            </Typography>
          </Stack>

          <IconButton size="small">
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {comment.text}
        </Typography>

        <Stack
          direction="row"
          spacing={3}
          sx={{ mt: 1, color: "text.secondary" }}
        >
          <Stack direction="row" sx={{ alignItems: "center" }} spacing={0.5}>
            <IconButton size="small" onClick={onReply}>
              <ChatBubbleOutlineIcon fontSize="small" />
            </IconButton>

            <Typography variant="caption">{comment.repliesCount}</Typography>
          </Stack>

          <IconButton size="small" onClick={onLike}>
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </Stack>
  );
};
