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
        gap: 1,
        py: 2,
      }}
    >
      {posts?.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </Box>
  );
};

export default PostsList;
