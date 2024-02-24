"use client";

import { ChangeEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Form from "@src/components/Form";
import { toast } from "sonner";

const CreatePrompt = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setIsSubmitting] = useState<boolean>(false);
  const [post, setPost] = useState({ prompt: "", tag: "", image: "" });

  const createPrompt = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Sending prompt creation request...");
      if (session?.user) {
        const response = await fetch("/api/prompt/new", {
          method: "POST",
          body: JSON.stringify({
            prompt: post.prompt,
            // @ts-ignore
            userId: session?.user?.id,
            tag: post.tag,
            image: post.image,
          }),
        });
        if (response.ok) {
          toast.success("Prompt created successfully!");
          router.push("/");
        } else {
          toast.info("Failed to create prompt. Please try again.");
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createPrompt}
    />
  );
};

export default CreatePrompt;
