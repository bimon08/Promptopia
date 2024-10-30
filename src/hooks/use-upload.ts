// d:/Projects/Promptopia/src/hooks/use-upload.ts

import { PostSchema } from "@src/models/post";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { IPost } from "types/Type";
import { z } from "zod";
import { useFileUpload } from "./use-file-upload";
import { useTags } from "./use-tags";

type useUploadProps = {
  post?: IPost | null;
  id?: string;
  onSubmit: (postData: Partial<IPost>) => void;
  onClose?: () => void;
};

export const useUpload = ({ post, id, onSubmit, onClose }: useUploadProps) => {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    message: post?.message || "",
    tag: post?.tag ? (Array.isArray(post.tag) ? post.tag : [post.tag]) : [],
    image: post?.imageUrl || "",
    audio: post?.audioUrl || "",
  });

  const {
    imageUrl,
    audioUrl,
    isLoading,
    isAudioUploading,
    isImageUploading,
    selectedImage,
    selectedAudio,
    handleFileChange,
    setSelectedAudio,
    setSelectedImage,
    handleFileRemove,
    audioObjectUrl,
  } = useFileUpload({ session });

  const {
    tags,
    addTag,
    removeTag,
    handleTagInputChange,
    handleTagInputBlur,
    handleAddTag,
  } = useTags({ formData, setFormData });

  useEffect(() => {
    if (post) {
      setFormData({
        message: post.message || "",
        tag: post.tag ? (Array.isArray(post.tag) ? post.tag : [post.tag]) : [],
        image: post.imageUrl || "",
        audio: post.audioUrl || "",
      });
    }
  }, [post]);

  const updateFormData = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    },
    [],
  );

  const resetForm = useCallback(() => {
    setSelectedAudio(null);
    setSelectedImage(null);
    setFormData({
      message: "",
      tag: [],
      image: "",
      audio: "",
    });
  }, [setSelectedAudio, setSelectedImage]);

 const handleSubmit = useCallback(
   async (event: React.FormEvent<HTMLFormElement>) => {
     event.preventDefault();
     setIsSubmitting(true);

     try {
       // Handle Image Upload
       if (selectedImage) {
         await handleFileChange("image")({
           target: { files: [selectedImage] },
         } as unknown as ChangeEvent<HTMLInputElement>);
       }

       // Handle Audio Upload
       if (selectedAudio) {
         await handleFileChange("audio")({
           target: { files: [selectedAudio] },
         } as unknown as ChangeEvent<HTMLInputElement>);
       }

       // Prepare Data for Submission
       const validatedData = PostSchema.parse({
         message: formData.message,
         tag: formData.tag,
         imageUrl: imageUrl || post?.imageUrl || "", // Retain previous image URL if no new image is uploaded
         audioUrl: audioUrl || post?.audioUrl || "", // Retain previous audio URL if no new audio is uploaded
         creator: session?.user?.id || "",
       });

       const payload = {
         ...validatedData,
       };

       // Submit Data
       const response = id
         ? await axios.patch(`/api/posts/${id}`, payload)
         : await axios.post("/api/posts", payload);

       if (response.status === 200 || response.status === 201) {
         toast.success("Post submitted successfully");
         onSubmit(response.data);

         // Reset form if we're creating a new post (not editing)
         if (!id) {
           resetForm();
         }

         if (onClose) {
           onClose();
         }
       } else {
         toast.error("Failed to submit post");
       }
     } catch (error: any) {
       console.error("Error submitting post", error);
       if (error instanceof z.ZodError) {
         toast.error(error.issues.map((issue) => issue.message).join("\n"));
       } else {
         toast.error("An error occurred while submitting the post");
       }
     } finally {
       setIsSubmitting(false);
     }
   },
   [
     formData,
     id,
     onSubmit,
     selectedAudio,
     selectedImage,
     handleFileChange,
     imageUrl,
     audioUrl,
     session?.user?.id,
     resetForm,
     onClose,
   ],
 );

  return {
    handleAddTag,
    imageUrl,
    tags,
    audioUrl,
    handleImageChange: handleFileChange("image"),
    handleAudioChange: handleFileChange("audio"),
    isLoading,
    isAudioUploading,
    isImageUploading,
    selectedImage,
    selectedAudio,
    setSelectedAudio,
    setSelectedImage,
    handleFileRemove,
    isSubmitting,
    handleFileChange,
    handleSubmit,
    removeTag,
    formData,
    audioObjectUrl,
    updateFormData,
    addTag,
    handleTagInputChange,
    handleTagInputBlur,
  };
};
