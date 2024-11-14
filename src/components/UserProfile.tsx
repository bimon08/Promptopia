import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { IPost } from "types/Type"; 

type UserProfileProps = {
  post: IPost;
  onClick: () => void;
  copied: string;
  handleCopy: () => void;
};

const UserImage = ({ image }: { image?: string | null }) => (
  <Image
    src={image ?? "/assets/images/default-user-image.png"}
    alt="user_image"
    width={40}
    height={40}
    className="max-h-full max-w-full flex-shrink-0 rounded-full object-cover"
  />
);

const UserAudio = ({ audio }: { audio?: string }) =>
  audio && <audio src={audio} controls />;

const UserProfile = ({
  post,
  onClick,
  copied,
  handleCopy,
}: UserProfileProps) => (
  <div className="flex items-start justify-between gap-5">
    <div
      className="flex flex-1 cursor-pointer items-center justify-start gap-3"
      onClick={onClick}
    >
      {post.user && (
        <>
          <UserImage image={post.user.image} />
          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900 dark:text-white">
              {post.user.username}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {post.user.email}
            </p>
          </div>
        </>
      )}
    </div>
    <div className="relative">
      <Button
        variant="ghost"
        className="z-50 flex w-auto flex-shrink-0 cursor-pointer items-center gap-3"
        onClick={(e) => {
          e.stopPropagation();
          handleCopy();
        }}
      >
        <div className="copy_btn flex-shrink-0">
          <Image
            key={copied}
            src={
              copied === post.message
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === post.message ? "tick_icon" : "copy_icon"}
            width={16} // Increased size for visibility
            height={16}
            className="h-4 w-4 sm:h-5 sm:w-5" // Responsive icon sizing
          />
        </div>
      </Button>
    </div>
  </div>
);

export default UserProfile;
