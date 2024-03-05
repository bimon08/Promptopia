import { PostType } from "@src/components/Type";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const usePrompt = (url?: string) => {
  const [data, setData] = useState<PostType[]>([]);
  const baseUrl = process.env.NEXTAUTH_URL as string;
  const getPrompt = useCallback(async () => {
    try {
      const response = await axios.get(
        url ? `${baseUrl}/url` : `${baseUrl}/api/prompt`,
      );
      if (response.status === 200) {
        const data = await response.data;
        setData(data);
        return;
      } else {
        toast.error("Failed to fetch prompts");
        return;
      }
    } catch (error: any) {
      toast.error(error.message);
      return;
    }
  }, [url, baseUrl]);

  function refetch() {
    getPrompt();
  }
  useEffect(() => {
    getPrompt();
  }, [getPrompt]);

  return { data, refetch };
};
