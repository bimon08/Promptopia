"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Profile from "@components/Profile";
import { ParamType } from "@src/app/api/_lib/type";

const UserProfile = ({ params }: ParamType) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${params?.id}/posts`);
      const data = await response.json();
      console.log(data);
      setUserPosts(data);
    };

    if (params?.id) fetchPosts();
  }, [params.id]);

  return (
    <Profile
      name={userName ?? ""}
      desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional messages and be inspired by the power of their imagination`}
      posts={userPosts}
    />
  );
};

export default UserProfile;
