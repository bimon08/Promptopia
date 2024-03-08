import { delete_image_func } from "@src/utils/delete_image_func";
import { upload_file_func } from "@src/utils/upload_file_func";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useUpload = () => {
  const { data: session } = useSession();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    };
  }),
    [imagePreviewUrl, audioPreviewUrl];

  const handleUpload = useCallback(
    async (file: File, fileType: "image" | "audio") => {
      if (!session?.user?.email) {
        toast.error("User email is not available.");
        return;
      }
      let toastId;
      try {
        setIsLoading(true);
        const toastId = toast.loading("Uploading...");
        console.log(file);
        const downloadUrl = await upload_file_func({
          file,
          userEmail: session.user.email,
          fileType,
        });
        toast.success(
          `${
            fileType.charAt(0).toUpperCase() + fileType.slice(1)
          } uploaded successfully`,
        );
        const fileUrl = URL.createObjectURL(file);
        fileType === "image"
          ? setImagePreviewUrl(fileUrl)
          : setAudioPreviewUrl(fileUrl);
        fileType === "image"
          ? setImageUrl(downloadUrl)
          : setAudioUrl(downloadUrl);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
        toast.dismiss(toastId);
      }
    },
    [session?.user?.email],
  );

const deleteUploadedFile = useCallback(
  async (
    fileUrl: string | null,
    fileType: "image" | "audio",
    email: string | null | undefined,
  ) => {
    if (fileUrl && email) {
      try {
        const fileName = fileUrl.split("/").pop();
        if (fileName) {
          await delete_image_func({ fileName, email });
          fileType === "image" ? setImageUrl(null) : setAudioUrl(null);
        }
      } catch (error) {
        console.error("Error deleting uploaded file:", error);
      }
    }
  },
  [],
);
  
  const handleFileChange =
    (fileType: "image" | "audio") => (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file, fileType);
    };

  return {
    imageUrl,
    audioUrl,
    handleImageChange: handleFileChange("image"),
    handleAudioChange: handleFileChange("audio"),
    isLoading,
    imagePreviewUrl,
    audioPreviewUrl,
    deleteUploadedFile,
  };
};
