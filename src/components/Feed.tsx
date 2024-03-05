"use client";

import { useState, ChangeEvent } from "react";
import { PromptCardList } from "./PromptCardList";
import { PostType } from "./Type";
import { usePrompt } from "@src/hooks/use-prompt";

interface FeedProps {
  data: PostType[];
  handleTagClick: (tagName: string) => void;
}

const Feed: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [searchedResults, setSearchedResults] = useState<PostType[]>([]);
  const { data: allPosts } = usePrompt();
  const filterPrompts = (searchtext: string) => {
    const regex = new RegExp(searchtext);
    return allPosts.filter(
      (item) =>
        regex.test(item.user?.username || "") ||
        regex.test(item.tag) ||
        regex.test(item.prompt),
    );
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchText(searchTerm);
    const searchTimeout = setTimeout(() => {
      const searchResult = filterPrompts(searchTerm);
      setSearchedResults(searchResult);
    }, 500);
    clearTimeout(searchTimeout);
  };

  const handleTagClick = (tagName: string) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className="feed">
      <form className="flex-center relative w-full">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {/* All Prompts */}
      <PromptCardList
        data={searchText ? searchedResults : allPosts}
        handleTagClick={handleTagClick}
      />
    </section>
  );
};

export default Feed;
