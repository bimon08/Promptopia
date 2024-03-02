import React from 'react';
import Image from 'next/image';

type UserProfileProps = {
  post: {
    user?: {
      image?: string;
      username?: string;
      email?: string;
    };
    prompt?: string;
    audio?:string
  };
  onClick: () => void;
  copied: string;
  handleCopy: () => void;
};

const UserProfile: React.FC<UserProfileProps> = ({
  post,
  onClick,
  copied,
  handleCopy,
}) => (
  <div className="flex items-start justify-between gap-5">
    <div
      className="flex flex-1 cursor-pointer items-center justify-start gap-3"
      onClick={onClick}
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
        <p className="font-inter text-sm text-gray-500">{post.user?.email}</p>
      </div>
    </div>
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
    {post.audio && <audio src={post.audio} controls />}
  </div>
);

export default UserProfile;
