"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Form from "@src/components/Form";
import { toast } from "sonner";
import { IPost } from "types/Type";

const CreateMessage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setIsSubmitting] = useState<boolean>(false);
  const [post, setPost] = useState<IPost>({
    id: "",
    message: "",
    tag: "",
    imageUrl: "",
    audioUrl: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (session?.user) {
        const response = await fetch("/api/posts/new", {
          method: "POST",
          body: JSON.stringify({
            message: post.message,
            userId: session.user.id,
            tag: post.tag,
            imageUrl: post.imageUrl,
            audioUrl: post.audioUrl,
          }),
        });
        if (response.ok) {
          toast.success("Message created successfully!");
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
      handleSubmit={handleSubmit}
    />
  );
};

export default CreateMessage;
