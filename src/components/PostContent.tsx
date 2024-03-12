// d:/Projects/Promptopia/src/components/PostContent.tsx

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@src/lib/utils";
import { CardItem } from "./ui/3d-card";
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
  const MAX_message_LENGTH = 100;
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

  useEffect(() => {
    const container = containerRef.current;
    if (container)
    {
       const scrollWidth = container.scrollWidth;
       const clientWidth = container.clientWidth;

      if (scrollWidth > clientWidth) {
        const initialScroll = Math.min(30, scrollWidth - clientWidth);
        
         controls
           .start({
             x: `-${initialScroll}px`,
             transition: { duration: 0.5, ease: "easeInOut" },
           })
           .then(() => {
             controls.start({
               x: "0px",
               transition: { duration: 0.5, ease: "easeInOut" },
             });
           });
       }
     }
  }, [controls]);

  const handleAudioClick = () => {
    if (audioRef.current) {
      if (audioRef.current.paused || audioRef.current.src !== post.audioUrl) {
        audioRef.current.src = post.audioUrl || "";
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  return (
    <>
      {post.imageUrl && (
        <CardItem className="mt-4" translateZ="40" translateY={10}>
          <Image
            src={post.imageUrl}
            alt="Description of the image"
            width={300}
            height={300}
            className="rounded-lg object-cover shadow-lg"
          />
        </CardItem>
      )}

      {post.message && (
        <CardItem className="mt-4 max-w-[250px]" translateZ="20">
          {post.message.split("\n").map((line, index) => (
            <p
              key={index}
              className={cn(
                "my-4",
                "text-sm",
                "text-gray-700",
                line.includes(" ") && "text-justify",
              )}
            >
              {line}
            </p>
          ))}
        </CardItem>
      )}

      {post.audioUrl && (
        <CardItem translateZ="100" className="w-full">
          <div className="mt-4">
            <audio controls ref={audioRef} className="w-full">
              <source src={post.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <button onClick={handleAudioClick}>
              {audioRef.current?.paused ||
                audioRef.current?.src !== post.audioUrl}
            </button>
          </div>
        </CardItem>
      )}

      <motion.div
        ref={containerRef}
        className="max-w-[250px] overflow-hidden whitespace-nowrap p-2"
      >
        <motion.div className="flex" animate={controls}>
          {Array.isArray(post.tag) &&
            post.tag.map((tag, index) => (
              <span
                key={index}
                onClick={() => handleTagClick(tag)}
                className="mr-2 inline-block cursor-pointer rounded bg-gray-200 px-2 py-1 text-gray-900"
              >
                #{tag.trim()}
              </span>
            ))}
        </motion.div>
      </motion.div>
    </>
  );
};

export default PostContent;
