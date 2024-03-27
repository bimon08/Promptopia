// src\hooks\use-posts.ts

import { IPost } from "types/Type";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const usePosts = () => {
  const [data, setData] = useState<IPost[]>([]);
  async function fetchPosts() {
    try {
      const response = await axios.get("/api/posts");
      if (response.status === 200) {
        const data = await response.data;
        setData(data);
        return;
      } else {
        toast.error("Failed to fetch posts");
        return;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 500) {
        toast.error("No internet connection.");
      } else {
        toast.error("An error occurred while fetching posts:", error.message);
      }
      return;
    }
  }
  function refetch() {
    console.log("Refetching posts...");
    fetchPosts();
  }
  useEffect(() => {
    fetchPosts();
  }, []);
  return { data, refetch };
};
