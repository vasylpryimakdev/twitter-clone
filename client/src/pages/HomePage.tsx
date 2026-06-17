import { Post } from "../components/Post/Post";
import type { Post as PostType } from "../components/Post/post.types";

const mockPosts: PostType[] = [
  {
    id: "1",
    title: "First post",
    text: "This is my first post in Twitter-like app built with React + NestJS + Firebase.",
    image: "https://picsum.photos/800/400?random=1",
    likesCount: 12,
    dislikesCount: 1,
    commentsCount: 3,
  },
  {
    id: "2",
    title: "React + MUI setup",
    text: "Today I learned how to properly use MUI Stack, Typography and sx styling system.",
    image: "https://picsum.photos/800/400?random=2",
    likesCount: 25,
    dislikesCount: 0,
    commentsCount: 7,
  },
  {
    id: "3",
    title: "Backend is ready",
    text: "NestJS API is running locally with Firebase emulator. Next step — connect React Query.",
    image: "https://picsum.photos/800/400?random=3",
    likesCount: 18,
    dislikesCount: 2,
    commentsCount: 5,
  },
];

export const HomePage = () => {
  return (
    <div>
      <h2>Home feed</h2>

      {mockPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};
