"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@src/components/Profile";
import { toast } from "sonner";
import { PostType } from "@src/components/Type";
import axios from "axios";
import { usePrompt } from "@src/hooks/use-prompt";

const MyProfile: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: posts, refetch } = usePrompt(
    // @ts-ignore
    `/api/users/${session?.user.id}/posts`,
  );

  const handleEdit = (post: PostType) => {
    if (post.id !== undefined) {
      router.push(`/update-prompt?id=${post.id}`);
    } else {
      toast.error("Post id is undefined, cannot navigate to the update page.");
    }
  };

  const handleDelete = async (id: string) => {
    const hasConfirmed = window.confirm(
      "Are you sure you want to delete this prompt?",
    );
    if (hasConfirmed) {
      // Directly check if post.id is undefined
      if (id === undefined || id === "") {
        toast.error("Failed to delete prompt: Post ID is undefined.");
        return; // Abort the deletion process
      }
      // Proceed with the deletion process since post.id is confirmed to be defined
      try {
        await axios.delete(`/api/prompt/${id}`);
        refetch();
        toast.success("Prompt deleted successfully");
        return;
      } catch (error) {
        toast.error("Failed to delete prompt");
        return;
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
