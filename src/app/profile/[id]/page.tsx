"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Profile from "@components/Profile";
import { ParamType } from "@src/app/api/_lib/type";

import { usePrompt } from "@src/hooks/use-prompt";

const UserProfile = ({ params }: ParamType) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");
  const { data: userPosts } = usePrompt(`/api/users/${params?.id}/posts`);

  return (
    <Profile
      name={userName ?? ""}
      desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
      data={userPosts}
    />
  );
};

export default UserProfile;
