"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { toast } from "sonner";
import axios from "axios";
import { PostType } from "./Type";
import PromptCard from "./PromptCard";

const Feed: React.FC = () => {
  const [allPosts, setAllPosts] = useState<PostType[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchedResults, setSearchedResults] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/prompt");
        if (response.status === 200) {
          setAllPosts(response.data);
        } else {
          toast.error("Failed to fetch prompts");
        }
      } catch (error) {
        toast.error(`An error occurred while fetching prompts: ${error}`);
      }
    };

    fetchPosts();
  }, []);

  const filterPrompts = (searchText: string) => {
    const regex = new RegExp(searchText, "i");
    return allPosts.filter(
      (item) =>
        regex.test(item.user?.username || "") ||
        regex.test(item.tag || "") ||
        regex.test(item.prompt || ""),
    );
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchText(searchTerm);
    const searchResult = filterPrompts(searchTerm);
    setSearchedResults(searchResult);
  };

  const handleTagClick = (tag: string) => {
    setSearchText(tag);
    const searchResult = filterPrompts(tag);
    setSearchedResults(searchResult);
  };

  return (
    <section className=" container ">
      <div className="items-center py-10 ">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="w-full  rounded-md border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div
        className=""
        style={{
          columnCount: 3,
          columnGap: "32px",
        }}
      >
        {(searchText ? searchedResults : allPosts).map((post) => (
          <div
            key={post._id}
            className="break-inside-avoid "
            style={{ breakInside: "avoid", marginBottom: "32px" }}
          >
            <PromptCard post={post} handleTagClick={handleTagClick} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Feed;
