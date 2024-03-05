"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import { PostType } from "./Type";
import UserProfile from "./UserProfile";
import PostContent from "./PostContent";

type PromptCardProps = {
  post: PostType;
  handleEdit?: () => void;
  handleDelete?: () => void;
  handleTagClick?: (postTag: string) => void;
};

const PromptCard = ({
  post,
  handleEdit,
  handleDelete,
  handleTagClick,
}: PromptCardProps) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const [copied, setCopied] = useState<string>("");

  const isUserProfile = useMemo(
    () => post?.user?.email === session?.user?.email,
    [post, session],
  );
  const handleProfileClick = useCallback(() => {
    const profilePath = isUserProfile
      ? "/profile"
      : `/profile/${post.user?.id}?name=${post.user?.username}`;
    router.push(profilePath);
  }, [router, isUserProfile, post.user]);

  const handleCopy = useCallback(() => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000);
  }, [post.prompt]);

  // TODO: Check if the current user is the owner of the post and is viewing their own profile
  const isOwnerViewing =
  // @ts-ignore
    session?.user?.id === post?.user?.id && pathName === "/profile";

  return (
    <div className="prompt_card">
      <UserProfile
        post={post}
        onClick={handleProfileClick}
        copied={copied}
        handleCopy={handleCopy}
      />
      <PostContent post={post} handleTagClick={handleTagClick} />
      {isOwnerViewing && (
        <div className="flex-center mt-5 gap-4 border-t border-gray-100 pt-3">
          <p
            className="green_gradient cursor-pointer font-inter text-sm"
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className="orange_gradient cursor-pointer font-inter text-sm"
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
