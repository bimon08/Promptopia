"use client";

import React, { ChangeEvent, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { usePosts } from "@src/hooks/use-posts";
import { useRouter } from "next/navigation";
import NavBar from "./NavBar";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import Feed from "./Feed";
import { IPost } from "types/Type";
import { SearchIcon } from "lucide-react";

const HomePage = () => {
  const { data: allPosts } = usePosts();
  const [searchText, setSearchText] = useState<string>("");
  const [searchedResults, setSearchedResults] = useState<IPost[]>([]);
  const router = useRouter();

  const placeholders = [
    "Search for a tag or a username",
    "e.g., JohnDoe",
    "e.g., #Inspire",
    "Type something you're interested in...",
    "Search for topics or hashtags",
    "Find posts about #Motivation",
    "Looking for something specific?",
    "Search for #Lifestyle, #Travel, or more...",
    "e.g., @JaneDoe",
    "What are you looking for today?",
    "Find your favorite content",
  ];

  const filterMessages = useCallback(
    (searchText: string) => {
      const regex = new RegExp(searchText, "i");
      return allPosts.filter(
        (item) =>
          regex.test(item.user?.username || "") ||
          regex.test(item.tag || "") ||
          regex.test(item.message || ""),
      );
    },
    [allPosts],
  );

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
    router.push(`/?tag=${tag}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialTag = urlParams.get("tag");
    if (initialTag) {
      setSearchText(initialTag);
      const searchResult = filterMessages(initialTag);
      setSearchedResults(searchResult);
    } else {
      setSearchText("");
      setSearchedResults([]);
    }

    const handlePopState = () => {
      const tag = urlParams.get("tag");
      if (tag) {
        setSearchText(tag);
        const searchResult = filterMessages(tag);
        setSearchedResults(searchResult);
      } else {
        setSearchText("");
        setSearchedResults([]);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [filterMessages]);

  const bibleVerse = [
    "So then, let us pursue what makes for peace",
    "and for mutual upbuilding, Romans 14:19",
  ];

  return (
    <>
      <NavBar />

      <div className="h-80vh fixed inset-0 flex flex-1 items-center justify-center overflow-hidden">
        <Image
          src="/assets/images/istock.webp"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="z-0 object-[left_-280px_top_0px] sm:object-center"
        />
        <section className="relative z-10 mt-[20%] flex flex-col items-center justify-center px-4 pb-10 font-inter text-white md:mt-[10%]">
          <div className="container text-center sm:-mt-20">
            <h1 className="mb-4 text-5xl font-bold md:text-7xl">
              Build and Grow
            </h1>
            <div className="whitespace-pre-line text-sm font-light leading-snug md:text-base">
              {bibleVerse.map((verse, index) => (
                <p key={index}>{verse}</p>
              ))}
            </div>
            <div className="flex items-center justify-center py-10">
              {/* Use the new PlaceholdersAndVanishInput component */}
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleSearchChange}
                onSubmit={(e) => e.preventDefault()} // Prevent form submit
              />
            </div>
          </div>
        </section>
      </div>

      <div className="relative z-20 mt-[70vh] h-full w-full rounded-3xl bg-purple-900 bg-opacity-0 bg-clip-padding py-1 backdrop-blur-3xl backdrop-filter">
        <Feed
          posts={searchText ? searchedResults : allPosts}
          handleTagClick={handleTagClick}
        />
      </div>
    </>
  );
};

export default HomePage;
