import { IPost } from "types/Type";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const usemessage = () => {
  const [data, setData] = useState<IPost[]>([]);
  async function getmessage() {
    try {
      const response = await axios.get("/api/message");
      if (response.status === 200) {
        const data = await response.data;
        setData(data);
        return;
      } else {
        toast.error("Failed to fetch messages");
        return;
      }
    } catch (error: any) {
      toast.error("An error occurred while fetching messages:", error);
      return;
    }
  }
  function refetch() {
    console.log("Refetching messages...");
    getmessage();
  }
  useEffect(() => {
    getmessage();
  }, []);
  return { data, refetch };
};
