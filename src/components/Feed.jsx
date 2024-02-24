"use client";

import { useState, useEffect } from "react";
import { PromptCardList } from "./PromptCardList";
import { toast } from "sonner";
import axios from "axios";
const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedResults, setSearchedResults] = useState([]);
  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/prompt");
      if (response.status === 200) {
        const data = await response.data;
        setAllPosts(data);
        return;
      } else {
        toast.error("Failed to fetch prompts");
      }
    } catch (error) {
      toast.error("An error occurred while fetching prompts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext);
    return allPosts.filter(
      (item) =>
        regex.test(item.user?.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt),
    );
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchText(searchTerm);
    const searchTimeout = setTimeout(() => {
      const searchResult = filterPrompts(searchTerm);
      setSearchedResults(searchResult);
    }, 500);
    clearTimeout(searchTimeout);
  };

  const handleTagClick = (tagName) => {
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
