import Link from "next/link";
import { PostType } from "./Type";
import { useUpload } from "@src/hooks/use-upload";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface FormProps {
  type: string;
  post: PostType;
  setPost: React.Dispatch<React.SetStateAction<PostType>>;
  submitting: boolean;
  handleSubmit: any;
}

const Form: React.FC<FormProps> = ({
  type,
  post,
  setPost,
  submitting,
  handleSubmit,
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const {
    handleImageChange,
    handleAudioChange,
    imageUrl,
    audioUrl,
    isLoading,
  } = useUpload();

  useEffect(() => {
    setPost((prev) => ({
      ...prev,
      audio_url: audioUrl ?? prev.audio_url,
      image_url: imageUrl ?? prev.image_url,
    }));
  }, [audioUrl, imageUrl, setPost]);

  const handleAddTag = () => {
    const inputElement = document.getElementById(
      "tagInput",
    ) as HTMLInputElement;
    const newTag = inputElement.value.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      inputElement.value = "";
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  }

  return (
    <section className="flex-start w-full max-w-full flex-col ">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Post</span>
      </h1>
      <p className="desc max-w-md text-left">
        {type} and share amazing prompts with the world, and let your
        imagination run wild with any AI-powered platform
      </p>

      <form
        onSubmit={handleSubmit}
        className="glassmorphism mt-10 flex w-full max-w-2xl flex-col gap-7"
      >
        <label>
          <span className="font-satoshi text-base font-semibold text-gray-700">
            Your AI Prompt
          </span>
          <Textarea
            value={post.prompt}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setPost({ ...post, prompt: e.target.value })
            }
            placeholder="Write your post here"
            required
            className="form_textarea"
          />
        </label>

        <label>
          <span className="font-satoshi text-base font-semibold text-gray-700">
            Field of Prompt{" "}
            <span className="font-normal">
              (#product, #webdevelopment, #idea, etc.)
            </span>
          </span>
          <div className="flex items-center  gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center  h-4 rounded-md text-sm font-medium text-gray-700"
              >
                {tag}
                <button
                  type="button"
                  className="ml-2 text-black  rounded-full hover:text-gray-700"
                  onClick={() => handleTagRemove(tag)}
                >
                  &times;
                </button>
              </div>
            ))}
            <div className="flex items-center">
              <Textarea
                id="tagInput"
                placeholder="Add a tag"
                className="form_input"
              />
              <button
                type="button"
                className="ml-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                onClick={handleAddTag}
              >
                +
              </button>
            </div>
          </div>
        </label>

        <div className="bg-grey-lighter flex h-auto w-full items-center justify-center">
          <label className="text-blue border-blue flex w-64 cursor-pointer flex-col items-center rounded-lg border bg-white px-4 py-6 uppercase tracking-wide shadow-lg ">
            <svg
              className="h-8 w-8"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span className="mt-2 text-base leading-3">
              {imageUrl ? "Image Selected" : "Select an Image"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <label className="text-blue border-blue flex w-64 cursor-pointer flex-col items-center rounded-lg border bg-white px-4 py-6 uppercase tracking-wide shadow-lg ">
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span className="mt-2 text-base leading-3">
              {audioUrl ? "Audio Selected" : "Select an Audio File"}
            </span>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleAudioChange}
            />
          </label>
        </div>

        <div className="flex-end mx-3 mb-5 gap-4">
          <Button>
            <Link href="/">Cancel</Link>
          </Button>
          <Button type="submit" disabled={submitting || isLoading}>
            {submitting ? "Loading" : type}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default Form;
