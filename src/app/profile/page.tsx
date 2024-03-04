"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@src/components/Profile";
import { toast } from "sonner";
import { PostType } from "@src/components/Type";
import axios from "axios";

const MyProfile: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<PostType[]>([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // @ts-ignore
        // FIXME: fix this ts error
        const response = await fetch(`/api/users/${session?.user.id}/posts`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();

        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to fetch posts");
      }
    };
    // @ts-ignore
    // FIXME: fix this ts error
    if (session?.user.id && status !== "loading") fetchPosts();
  }, [session, status]);

  const handleEdit = (post: PostType) => {
    if (post.id !== undefined) {
      router.push(`/update-prompt?id=${post.id}`);
    } else {
      console.error(
        "Post id is undefined, cannot navigate to the update page.",
      );
    }
  };

  const handleDelete = async (post: PostType) => {
    const hasConfirmed = window.confirm(
      "Are you sure you want to delete this prompt?",
    );
    if (hasConfirmed) {
      // Directly check if post.id is undefined
      if (typeof post.id === "undefined") {
        console.error("Cannot delete the prompt as the post ID is undefined.");
        toast.error("Failed to delete prompt: Post ID is undefined.");
        return; // Abort the deletion process
      }

      // Proceed with the deletion process since post.id is confirmed to be defined
      try {
        await axios.delete(`/api/prompt/${post.id.toString()}`);
        const filteredPosts = posts.filter((p) => p.id !== post.id);
        setPosts(filteredPosts);
        toast.success("Prompt deleted successfully");
      } catch (error) {
        console.error("Error deleting prompt:", error);
        toast.error("Failed to delete prompt"); 
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
