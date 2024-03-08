import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@src/lib/utils";
import { CardItem } from "./ui/3d-card";

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

      <CardItem translateZ="20">
        {post.tag.split(",").map((tag, index) => (
          <span
            key={index}
            className="blue_gradient mr-2 cursor-pointer font-inter text-sm"
            onClick={() => handleTagClick(tag)}
          >
            #{tag.trim()}
          </span>
        ))}
      </CardItem>
    </>
  );
};

export default PostContent;
