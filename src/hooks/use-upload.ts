import { upload_file_func } from "@src/utils/upload_file_func";
import { useSession } from "next-auth/react";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useUpload = () => {
  const { data: session } = useSession();
  const [imageUrl, setImageUrl] = useState<string | null>("");
  const [audioUrl, setAudioUrl] = useState<string | null>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleUploadImage = useCallback(async () => {
    try {
      setIsLoading(true);
      if (selectedFile) {
        const imageDownloadUrl = await upload_file_func({
          selectedFile,
          email: session?.user?.email ?? "",
          fileType: "image",
        });
        toast.success("Image uploaded successfully");
        setImageUrl(imageDownloadUrl || null);
        setIsLoading(false);
        return;
      }
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    } finally {
      setIsLoading(false);
      selectedFile && setSelectedFile(null);
    }
  }, [selectedFile, session?.user?.email]);
  const handleUploadAudio = useCallback(async () => {
    try {
      setIsLoading(true);
      if (selectedAudio) {
        const audioDownloadUrl = await upload_file_func({
          selectedFile: selectedAudio,
          email: session?.user?.email ?? "",
          fileType: "audio",
        });
        toast.success("Audio uploaded successfully");
        setAudioUrl(audioDownloadUrl || null);
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      selectedAudio && setSelectedAudio(null);
    }
  }, [selectedAudio, session?.user?.email]);

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
    if (selectedFile) {
      handleUploadImage();
    }
  }, [selectedFile, handleUploadImage]);

  useEffect(() => {
    if (selectedAudio) {
      handleUploadAudio();
    }
  }, [selectedAudio, handleUploadAudio]);
  return {
    imageUrl: imageUrl,
    audioUrl: audioUrl,
    imageChange: handleFileChange,
    audioChange: handleAudioChange,
    audioFile: selectedAudio,
    imageFile: selectedFile,
    loading: isLoading,
  };
};
