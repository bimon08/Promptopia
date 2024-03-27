// d:/Projects/Promptopia/src/components/PostContent.tsx

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@src/lib/utils";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { motion, useAnimation } from "framer-motion";

type PostContentProps = {
  post: {
    imageUrl?: string;
    message?: string;
    tag: string;
    audioUrl?: string;
  };
  handleTagClick: (postTag: string) => void;
};

const PostContent: React.FC<PostContentProps> = ({ post, handleTagClick }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<null | HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const handleAudioPlay = () => {
      document.querySelectorAll("audio").forEach((audio) => {
        if (audio !== audioRef.current) {
          audio.pause();
        }
      });
    };

    const currentAudio = audioRef.current;
    currentAudio?.addEventListener("play", handleAudioPlay);

    return () => {
      currentAudio?.removeEventListener("play", handleAudioPlay);
    };
  }, []);

  

  return (
    <div className="flex min-w-fit max-w-[300px] flex-col items-center justify-center rounded-lg text-center">
      {post.imageUrl && (
        <div className="mb-4">
          <Image
            src={post.imageUrl}
            alt="Description of the image"
            width={300}
            height={200}
            className="rounded-2xl object-cover"
          />
        </div>
      )}

      {post.message && (
        <div className="mb-4 items-center justify-center rounded-xl  bg-white p-4 text-center shadow-md dark:bg-gray-600">
          {post.message.split("\n").map((line, index) => (
            <p
              key={index}
              className={cn(
                "text-gray-700 dark:text-gray-300",
                line.includes(" ") && "text-justify",
              )}
            >
              {line}
            </p>
          ))}
        </div>
      )}

      {post.audioUrl && (
        <CardItem className="mb-4 w-full" translateZ={20}>
          <audio controls ref={audioRef} className="w-full">
            <source src={post.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </CardItem>
      )}

      <motion.div
        ref={containerRef}
        className="mb-4 max-w-[320px] space-x-2 overflow-x-auto whitespace-nowrap"
        style={{
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        >
        {Array.isArray(post.tag) &&
          post.tag.map((tag, index) => (
            <span
              key={index}
              onClick={() => handleTagClick(tag)}
              className="cursor-pointer rounded-full bg-gray-600 px-3 py-1 text-sm text-white dark:text-gray-300"
            >
              #{tag.trim()}
            </span>
          ))}
      </motion.div>
    </div>
  );
};

export default PostContent;
