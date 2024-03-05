"use client";

import { ChangeEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Form from "@src/components/Form";
import { toast } from "sonner";
import { PostType } from "@src/components/Type";
import axios from "axios";

const CreatePrompt = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setIsSubmitting] = useState<boolean>(false);
  const [post, setPost] = useState<PostType>({
    prompt: "",
    tag: "",
    image_url: "",
    audio_url: "",
  });

  const createPrompt = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (session?.user) {
        const response = await axios.post("/api/prompt/new", {
          prompt: post.prompt,
          // @ts-ignore
          // FIXME: fix this ts error
          // Update the userId property to use the correct property from session?.user
          userId: session?.user?.id,
          tag: post.tag,
          image_url: post.image_url,
          audio_url: post.audio_url,
        });
        if (response.status === 201) {
          toast.success("Prompt created successfully!");
          router.push("/");
          return;
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
