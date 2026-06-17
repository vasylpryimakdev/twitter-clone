import { Post } from "../components/Post/Post";
import type { Post as PostType } from "../types/post.types";

const mockPosts: PostType[] = [
  {
    id: "1",
    title: "First post",
    text: "This is my first post in Twitter-like app built with React + NestJS + Firebase.",
    image: "https://picsum.photos/800/400?random=1",
    likesCount: 12,
    dislikesCount: 1,
    commentsCount: 3,
    user: {
      id: "u1",
      name: "Vasyl Pryimak",
      username: "vasyl",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
  },
  {
    id: "2",
    title: "React + MUI setup",
    text: "Today I learned how to properly use MUI Stack, Typography and sx styling system.",
    image: "https://picsum.photos/800/400?random=2",
    likesCount: 25,
    dislikesCount: 0,
    commentsCount: 7,
    user: {
      id: "u2",
      name: "John Doe",
      username: "johndoe",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
  },
  {
    id: "3",
    title: "Backend is ready",
    text: "NestJS API is running locally with Firebase emulator. Next step — connect React Query.",
    image: "https://picsum.photos/800/400?random=3",
    likesCount: 18,
    dislikesCount: 2,
    commentsCount: 5,
    user: {
      id: "u3",
      name: "Alex Smith",
      username: "alexsmith",
      avatar: "https://i.pravatar.cc/150?img=45",
    },
  },
];

export const HomePage = () => {
  return (
    <div>
      {mockPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};
