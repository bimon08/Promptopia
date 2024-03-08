"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@src/components/Profile";
import { toast } from "sonner";
import { IPost } from "types/Type";
import axios from "axios";

const MyProfile: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/users/${session?.user.id}/posts`);
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to fetch posts");
      }
    };
    if (session?.user.id) {
      if (status === "authenticated") {
        fetchPosts();
      }
    }
  }, [session?.user.id, status]);

  const handleEdit = (post: IPost) => {
    if (post.id !== undefined) {
      router.push(`/update-message?id=${post.id}`);
    } else {
      console.error(
        "Post id is undefined, cannot navigate to the update page.",
      );
    }
  };

  const handleDelete = async (post: IPost) => {
    const hasConfirmed = window.confirm(
      "Are you sure you want to delete this message?",
    );
    if (hasConfirmed) {
      if (typeof post.id === "undefined") {
        console.error("Cannot delete the message as the post ID is undefined.");
        toast.error("Failed to delete message: Post ID is undefined.");
        return;
      }

      try {
        await axios.delete(`/api/message/${post.id.toString()}`);
        const filteredPosts = posts.filter((p) => p.id !== post.id);
        setPosts(filteredPosts);
        toast.success("message deleted successfully");
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error("Failed to delete message");
      }
    }
  };

  return (
    <div>
      <Profile
        name="My"
        desc="Welcome to your personalized profile page"
        data={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default MyProfile;
