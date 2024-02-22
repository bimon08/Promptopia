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
    if (post?.creator?._id === session?.user) return router.push("/profile");

    router.push(`/profile/${post.creator?._id}?name=${post.creator?.username}`);
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
          className="flex items-center justify-start flex-1 gap-3 cursor-pointer"
          onClick={handleProfileClick}
        >
          <Image
            src={post.creator?.image ?? ""}
            alt="user_image"
            width={40}
            height={40}
            className="object-contain rounded-full"
          />

          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900 font-satoshi">
              {post.creator?.username}
            </h3>
            <p className="text-sm text-gray-500 font-inter">
              {post.creator?.email}
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
            className="object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      {post.prompt && post.prompt.includes("\n") ? (
        <pre className="my-4 text-sm text-gray-700 font-satoshi">
          {post.prompt}
        </pre>
      ) : (
        <p className="my-4 text-sm text-gray-700">{post.prompt}</p>
      )}

      <p
        className="text-sm cursor-pointer blue_gradient font-inter"
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        {post.tag}
      </p>

      {session?.user === post.creator?._id && pathName === "/profile" && (
        <div className="gap-4 pt-3 mt-5 border-t border-gray-100 flex-center">
          <p
            className="text-sm cursor-pointer green_gradient font-inter"
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className="text-sm cursor-pointer orange_gradient font-inter"
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
