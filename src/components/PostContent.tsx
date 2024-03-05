import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@src/lib/utils";

type PostContentProps = {
  post: {
    image_url?: string;
    prompt?: string;
    tag?: string;
    audio_url?: string;
  };
  handleTagClick?: (postTag: string) => void;
};

const PostContent: React.FC<PostContentProps> = ({ post, handleTagClick }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    console.log("Audio reference:", audioRef.current);
    if (audioRef.current) {
      if (audioRef.current.paused || audioRef.current.src !== post.audio_url) {
        audioRef.current.src = post.audio_url || "";

        // Start with a very low volume
        audioRef.current.volume = 0.01;
        console.log("Starting volume:", audioRef.current.volume);

        // Play the audio
        audioRef.current.play();

        // Gradually increase the volume over time
        let currentVolume = 0.01;
        const increaseVolume = setInterval(() => {
          if (audioRef.current && audioRef.current.volume < 1) {
            audioRef.current.volume = currentVolume;
            console.log("Current volume:", audioRef.current.volume);
            currentVolume += 0.1; // Increase volume incrementally
          } else {
            clearInterval(increaseVolume);
          }
        }, 100); // Adjust the interval as needed
      } else {
        audioRef.current.pause();
      }
    }
  };

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
                line.includes(" ") && "text-justify",
              )}
            >
              {line}
            </p>
          ))}
        </div>
      )}
      {post.audio_url && (
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
      )}

      <p
        className="blue_gradient cursor-pointer font-inter text-sm"
        onClick={() => post.tag && handleTagClick && handleTagClick(post.tag)}
      >
        #{post.tag}
      </p>
    </>
  );
};

export default PostContent;
