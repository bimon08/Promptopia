"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@src/components/Profile";
import { toast } from "sonner"
import { PostType } from "@src/components/Type";



const MyProfile: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [posts, setPosts] = useState<PostType[]>([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // @ts-ignore
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
    if (session?.user.id) fetchPosts();
  }, [session]);

  const handleEdit = (post: PostType) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post: PostType) => {
    const hasConfirmed = window.confirm(
      "Are you sure you want to delete this prompt?",
    );
    if (hasConfirmed) {

      // TODO: Handle post._id
      try {

        // @ts-ignore
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });
        const filteredPosts = posts.filter((p) => p._id !== post._id);
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
