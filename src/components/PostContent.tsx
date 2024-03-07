import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@src/lib/utils";
import { CardItem } from "./ui/3d-card";

type PostContentProps = {
  post: {
    image_url?: string;
    prompt?: string;
    tag: string;
    audio_url?: string;
  };
  handleTagClick: (postTag: string) => void;
};

const PostContent: React.FC<PostContentProps> = ({ post, handleTagClick }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const MAX_PROMPT_LENGTH = 100;

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
      if (audioRef.current.paused || audioRef.current.src !== post.audio_url) {
        audioRef.current.src = post.audio_url || "";
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  return (
    <>
      {post.image_url && (
        <CardItem className="mt-4" translateZ="40" translateY={10}>
          <Image
            src={post.image_url}
            alt="Description of the image"
            width={300}
            height={300}
            className="rounded-lg object-cover shadow-lg"
          />
        </CardItem>
      )}

      {post.prompt && (
        <CardItem className="mt-4 max-w-[250px]" translateZ="20">
          {post.prompt.split("\n").map((line, index) => (
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

      {post.audio_url && (
        <CardItem translateZ="100" className="w-full">
          <div className="mt-4">
            <audio controls ref={audioRef} className="w-full">
              <source src={post.audio_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <button onClick={handleAudioClick}>
              {audioRef.current?.paused ||
              audioRef.current?.src !== post.audio_url
                ? "Play"
                : "Pause"}
            </button>
          </div>
        </CardItem>
      )}

      <CardItem translateZ="20">
        <p
          className="blue_gradient cursor-pointer font-inter text-sm"
          onClick={() => post.tag && handleTagClick && handleTagClick(post.tag)}
        >
          #{post.tag}
        </p>
      </CardItem>
    </>
  );
};

export default PostContent;
