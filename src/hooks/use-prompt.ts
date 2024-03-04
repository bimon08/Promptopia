import { PostType } from "@src/components/Type";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const usePrompt = () => {
  const [data, setData] = useState<PostType[]>([]);
  async function getPrompt() {
    try {
      const response = await axios.get("/api/prompt");
      if (response.status === 200) {
        const data = await response.data;
        setData(data);
        return;
      } else {
        toast.error("Failed to fetch prompts");
        return;
      }
    } catch (error: any) {
      toast.error("An error occurred while fetching prompts:", error);
      return;
    }
  }
  function refetch() {
    console.log("Refetching prompts...");
    getPrompt();
  }
  useEffect(() => {
    getPrompt();
  }, []);
  return { data, refetch };
};
