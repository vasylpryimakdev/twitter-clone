import { useEffect, useState } from "react";
import PostsList from "../components/posts/PostsList";
import { PaginationList } from "../components/posts/PostsPagination";
import { usePosts } from "../hooks/usePosts";
import { SearchBar } from "../components/SearchBar";
import { Stack } from "@mui/material";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(t);
  }, [search]);

  const query = usePosts({ search: debouncedSearch });

  return (
    <Stack sx={{ p: 4, width: "100%" }}>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search posts..."
      />

      <PaginationList query={query}>
        {(items) => <PostsList posts={items} />}
      </PaginationList>
    </Stack>
  );
};
