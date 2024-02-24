"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import { PostType } from "./Type";

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
  const [copied, setCopied] = useState<string>();

  const handleProfileClick = () => {
    if (post?.user?.email === session?.user?.email)
      return router.push("/profile");
    router.push(`/profile/${post.user?.id}?name=${post.user?.username}`);
  };

  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000);
  };

  return (
    <div className="prompt_card">
      <div className="flex items-start justify-between gap-5">
        <div
          className="flex flex-1 cursor-pointer items-center justify-start gap-3"
          onClick={handleProfileClick}
        >
          <Image
            src={post.user?.image ?? ""}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />

          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900">
              {post.user?.username}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {post.user?.email}
            </p>
          </div>
        </div>{" "}
        <div className="copy_btn" onClick={handleCopy}>
          <Image
            src={
              copied === post.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </div>
      </div>

      {post.image_url && (
        <div className="mt-4">
          <Image
            src={post.image_url}
            alt="Description of the image"
            width={300}
            height={300}
            className="rounded-lg object-cover shadow-lg"
          />
        </div>
      )}

      {post.prompt && post.prompt.includes("\n") ? (
        <pre className="my-4 font-satoshi text-sm text-gray-700">
          {post.prompt}
        </pre>
      ) : (
        <p className="my-4 text-sm text-gray-700">{post.prompt}</p>
      )}

      <p
        className="blue_gradient cursor-pointer font-inter text-sm"
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        {post.tag}
      </p>

      {/* @ts-ignore */}
      {session?.user?.id === post.user?.id && pathName === "/profile" && (
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
