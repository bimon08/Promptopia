"use client";

import { useState, ChangeEvent } from "react";
import { IPost } from "../../types/Type";
import MessageCard from "./MessageCard";
import { usePosts } from "@src/hooks/use-posts";

const Feed: React.FC = () => {
  const {data: allPosts, refetch} = usePosts();
  const [searchText, setSearchText] = useState<string>("");
  const [searchedResults, setSearchedResults] = useState<IPost[]>([]);
  const [cachedPosts, setCachedPosts] = useState<IPost[]>([]);

  

  const filterMessages = (searchText: string) => {
    const regex = new RegExp(searchText, "i");
    return allPosts.filter(
      (item) =>
        regex.test(item.user?.username || "") ||
        regex.test(item.tag || "") ||
        regex.test(item.message || ""),
    );
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchText(searchTerm);
    const searchResult = filterMessages(searchTerm);
    setSearchedResults(searchResult);
  };

  const handleTagClick = (tag: string) => {
    setSearchText(tag);
    const searchResult = filterMessages(tag);
    setSearchedResults(searchResult);
  };

  return (
    <section className=" container mb-32 ">
      <div className="items-center justify-center py-10">
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
            key={post.id}
            className="break-inside-avoid "
            style={{ breakInside: "avoid", marginBottom: "32px" }}
          >
            <MessageCard post={post} handleTagClick={handleTagClick} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Feed;
