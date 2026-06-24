import { Box } from "@mui/material";
import type { Post as PostType } from "../../types/post.types";
import { PostCard } from "./PostCard";

type Props = {
  posts: PostType[];
};

const PostsList = ({ posts }: Props) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        mt: 3,
        gap: 1,
        py: 4,

        // 👇 новий стиль
        px: 2,
        borderRadius: 3,
        backgroundColor: "grey.50",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {posts?.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </Box>
  );
};

export default PostsList;
