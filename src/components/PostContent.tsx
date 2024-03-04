import React from "react";
import Image from "next/image";
import { cn } from "@src/lib/utils";

type PostContentProps = {
  post: {
    image_url?: string;
    prompt?: string;
    tag?: string;
    audio_url?:string
  };
  handleTagClick?: (postTag: string) => void;
};

const PostContent: React.FC<PostContentProps> = ({ post, handleTagClick }) => {
  return (
    <>
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

      {post.prompt && (
        <div className="max-w-[300px]">
          {post.prompt.split("\n").map((line, index) => (
            <p
              key={index}
              className={cn(
                "my-4",
                "text-sm",
                "text-gray-700",
                line.includes(
                  " ",
                ) && "text-justify",
              )}
            >
              {line}
            </p>
          ))}
        </div>
      )}
      {post.audio_url && (
        <div className="mt-4">
          <audio controls className="w-full">
            <source src={post.audio_url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <p
        className="blue_gradient cursor-pointer font-inter text-sm"
        onClick={() => post.tag && handleTagClick && handleTagClick(post.tag)}
      >
        #{post.tag}
      </p>
    </>
  
  )
}

export default PostContent;
