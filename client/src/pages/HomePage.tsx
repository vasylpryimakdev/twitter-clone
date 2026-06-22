import PostsList from "../components/posts/PostsList";
import { PaginationList } from "../components/posts/PostsPagination";
import { usePosts } from "../hooks/usePosts";

export const HomePage = () => {
  const query = usePosts();

  return (
    <PaginationList query={query}>
      {(items) => <PostsList posts={items} />}
    </PaginationList>
  );
};
