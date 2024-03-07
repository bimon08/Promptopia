// Import necessary modules
"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PostType } from "@src/components/Type";
import Form from "@src/components/Form";
import { toast } from "sonner";
import axios from "axios";
import { Dialog } from "@src/components/ui/dialog";

const UpdatePrompt = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");
  const [submitting, setIsSubmitting] = useState(false);
 const [post, setPost] = useState<PostType>({
   prompt: "",
   tag: "",
   image_url: "",
   audio_url: "",
 });

  
  const getPromptDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/api/prompt/${promptId}`);
      if (response.status !== 200) {
        toast.error("Failed to fetch prompt details");
        return;
      }
      const data = await response.data;
      setPost({
        prompt: data.prompt,
        tag: data.tag,
        image_url: data.image,
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [promptId]);

  useEffect(() => {
    if (promptId) getPromptDetails();
  }, [promptId, getPromptDetails]);

  const updatePrompt = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!promptId) {
      alert("Missing PromptId!");
      setIsSubmitting(false);
      return;
    }

    try {
      if (!post) {
        console.error("Missing post data");
        return;
      }

      const response = await axios.patch(`/api/prompt/${promptId}`, {
        prompt: post.prompt,
        tag: post.tag,
        image_url: post.image_url,
      });

      if (response.status === 200) {
        router.push("/");
        toast.success("Prompt updated successfully");
        return;
      } else {
        toast.error("Failed to update prompt");
        return;
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      

      {post && (
        <Form
          type="Save"
          post={post as PostType}
          setPost={setPost}
          submitting={submitting}
          handleSubmit={updatePrompt}
        />
      )}
    </>
  );
};

export default UpdatePrompt;
