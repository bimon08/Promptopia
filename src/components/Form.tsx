import Link from "next/link";
import { PostType } from "./Type";
import { useSession } from "next-auth/react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { upload_file_func } from "@src/utils/upload_file_func";

interface FormPropsType {
  type: string;
  post: PostType;
  setPost: React.Dispatch<React.SetStateAction<PostType>>;
  submitting: boolean;
  handleSubmit: any;
}

const Form = ({
  type,
  post,
  setPost,
  submitting,
  handleSubmit,
}: FormPropsType) => {
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);

  const handleUpload = useCallback(async () => {
    try {
      console.log("uploading file...");
      toast.loading("Uploading file...");
      let downloadurl;
      let uploadCompleted = false; // Flag to track upload completion

      if (selectedFile && !uploadCompleted) {
        downloadurl = await upload_file_func({
          selectedFile,
          email: session?.user?.email ?? "",
          fileType: "image",
        });
        toast.success("Image uploaded successfully");
        console.log(downloadurl);
        uploadCompleted = true;
      }

      if (selectedAudio && !uploadCompleted) {
        downloadurl = await upload_file_func({
          selectedFile: selectedAudio,
          email: session?.user?.email ?? "",
          fileType: "audio",
        });
        toast.success("Audio uploaded successfully");
        uploadCompleted = true;
      }

      setDownloadURL(downloadurl || null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toast.dismiss();
    }
  }, [selectedFile, selectedAudio, session?.user?.email]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedAudio(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (selectedFile || selectedAudio) {
      handleUpload();
    }
  }, [selectedFile, selectedAudio, handleUpload]);
  // temporary fix for the ts error
  const handlePostChange = useCallback(() => {
    if (downloadURL) {
      setPost({
        ...post,
        image_url: selectedFile ? downloadURL : "",
        audio_url: selectedAudio ? downloadURL : "",
      });
    }
  }, [downloadURL, selectedFile, selectedAudio, setPost, post]);

  return (
    <section className="flex-start w-full max-w-full flex-col">
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
          <textarea
            value={post.prompt}
            onChange={(e) => setPost({ ...post, prompt: e.target.value })}
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
          <input
            value={post.tag}
            onChange={(e) => setPost({ ...post, tag: e.target.value })}
            type="text"
            placeholder="#Tag"
            required
            className="form_input"
          />
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
              {selectedFile ? "Image Selected" : "Select an Image"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <label className="text-blue border-blue flex w-64 cursor-pointer flex-col items-center rounded-lg border bg-white px-4 py-6 uppercase tracking-wide shadow-lg ">
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span className="mt-2 text-base leading-3">
              {selectedAudio ? "Audio Selected" : "Select an Audio File"}
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
          <Link href="/" className="text-sm text-gray-500">
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            onClick={handlePostChange}
            className="bg-primary-orange rounded-full px-5 py-1.5 text-sm text-black"
          >
            {submitting ? "Loading" : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
