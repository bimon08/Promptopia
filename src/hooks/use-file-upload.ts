// d:/Projects/Promptopia/src/hooks/use-file-upload.ts

import { upload_file_func } from "@src/utils/upload_file_func";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type useFileUploadProps = {
  session: any;
};

export const useFileUpload = ({ session }: useFileUploadProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [isAudioUploading, setIsAudioUploading] = useState<boolean>(false);
  const [audioObjectUrl, setAudioObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl);
    };
  }, [audioObjectUrl]);

  const handleUpload = useCallback(
    async (file: File, fileType: "image" | "audio") => {
      if (!session?.user?.email) {
        toast.error("User email is not available.");
        return;
      }

      let toastId;
      try {
        if (fileType === "image") {
          setIsImageUploading(true);
        } else if (fileType === "audio") {
          setIsAudioUploading(true);
        }
        setIsLoading(true);
        toastId = toast.loading("Uploading...");

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
        fileType === "image"
          ? setImageUrl(downloadUrl)
          : setAudioUrl(downloadUrl);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        if (fileType === "image") {
          setIsImageUploading(false);
        } else if (fileType === "audio") {
          setIsAudioUploading(false);
        }
        setIsLoading(false);
        toast.dismiss(toastId);
      }
    },
    [session?.user?.email],
  );

const handleFileChange = useCallback(
  (fileType: "image" | "audio") => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (fileType === "image" && !imageUrl) {
        setSelectedImage(file);
        setIsImageUploading(true);
        handleUpload(file, fileType);
      }
      if (fileType === "audio" && !audioUrl) {
        setSelectedAudio(file);
        setAudioObjectUrl(URL.createObjectURL(file));
        setIsAudioUploading(true);
        handleUpload(file, fileType);
      }
    }
  },
  [handleUpload, imageUrl, audioUrl],
);

  const handleFileRemove = useCallback((fileType: "image" | "audio") => {
    fileType === "image" ? setSelectedImage(null) : setSelectedAudio(null);
    fileType === "image" ? setImageUrl(null) : setAudioUrl(null);
  }, []);

  return {
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
  };
};
