import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { CardItem } from "./ui/3d-card";
import { motion, useAnimation } from "framer-motion";

type PostContentProps = {
  post: {
    imageUrl?: string;
    message?: string;
    tag: string | string[];
    audioUrl?: string;
  };
  handleTagClick: (postTag: string) => void;
};

const PostContent: React.FC<PostContentProps> = ({ post, handleTagClick }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
    <div className="flex flex-col items-center justify-center rounded-lg text-center">
      {post.imageUrl && (
        <div className="mb-4 w-[250px] sm:w-[200px] md:w-[400px] lg:w-[400px] xl:w-[450px]">
          <Image
            src={post.imageUrl}
            alt="Description of the image"
            width={300}
            height={200}
            className="h-auto w-full rounded-2xl object-cover"
          />
        </div>
      )}
      {post.message && (
        <div className="px-14 sm:px-96 md:px-8">
          <div className="mb-4 w-full max-w-xs rounded-xl bg-white p-4 text-left shadow-md dark:bg-gray-600 sm:w-[260px] sm:max-w-sm md:w-[300px] md:max-w-md lg:w-[400px] xl:max-w-xl">
            {post.message.split("\n").map((line, index) => (
              <p
                key={index}
                className={`text-gray-700 dark:text-gray-300 ${
                  line.trim() === "" ? "mb-4" : ""
                }`}
              >
                {line || <br />}
              </p>
            ))}
          </div>
        </div>
      )}
      {post.audioUrl && (
        <CardItem className="mb-4 w-[250px] lg:w-[350px]" translateZ={20}>
          <audio controls ref={audioRef} className="w-full">
            <source src={post.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </CardItem>
      )}
      <motion.div
        className="mb-8 mt-4 max-w-full space-x-2 overflow-x-auto whitespace-nowrap sm:max-w-[298px]"
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
              className="cursor-pointer mb-6 rounded-full bg-gray-600 px-3 py-1 text-sm text-white dark:text-gray-300"
            >
              #{tag.trim()}
            </span>
          ))}
      </motion.div>
    </div>
  );
};

export default PostContent;
