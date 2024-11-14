"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Profile from "@src/components/Profile";
import NavBar from "@src/components/NavBar";
import { AuroraBackground } from "@src/components/ui/aurora-background";
import { IPost } from "types/Type";
import { ParamType } from "@src/app/api/_lib/type";

const UserProfile: React.FC<{ params: { id: string } }> = ({ params }) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name") || "User";

  const [userPosts, setUserPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!params?.id) {
          console.log("No user ID found in params.");
          return;
        }
        const response = await fetch(`/api/users/${params.id}/posts`);
        if (!response.ok) throw new Error("Failed to fetch user posts");
        const data = await response.json();
        setUserPosts(data);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        toast.error("Failed to fetch user posts");
      }
    };

    if (params?.id) fetchPosts();
  }, [params?.id]);

  return (
    <AuroraBackground>
      <NavBar />
      <Profile
        name={userName}
        desc={`Welcome to ${userName}'s profile page.`}
        posts={userPosts}
      />
    </AuroraBackground>
  );
};

export default UserProfile;
