"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { toast } from "sonner";
import axios from "axios";
import { IPost } from "../../types/Type";
import MessageCard from "./MessageCard";

const Feed: React.FC = () => {
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchedResults, setSearchedResults] = useState<IPost[]>([]);
  const [cachedPosts, setCachedPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (cachedPosts.length > 0) {
          setAllPosts(cachedPosts);
        } else {
          const response = await axios.get("/api/message");
          if (response.status === 200) {
            setAllPosts(response.data);
            //  response.data.forEach((post: IPost) => {
            //  });
            setCachedPosts(response.data);
          } else {
            toast.error("Failed to fetch messages");
          }
        }
      } catch (error) {
        console.log("Error fetching posts:", error);
        toast.error(`An error occurred while fetching messages: ${error}`);
      }
    };

    fetchPosts();
  }, [cachedPosts]);

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
