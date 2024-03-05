import { upload_file_func } from "@src/utils/upload_file_func";
import { useSession } from "next-auth/react";
import { ChangeEvent, useCallback, useState } from "react";
import { toast } from "sonner";

export const useUpload = () => {
  const { data: session } = useSession();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleFileChange =
    (fileType: "image" | "audio") => (e: ChangeEvent<HTMLInputElement>) => {
      toast.success("Code is up and running");
      console.log("File changed:", e.target.files);
      const file = e.target.files?.[0];
      if (file) handleUpload(file, fileType);
    };

  return {
    imageUrl,
    audioUrl,
    handleImageChange: handleFileChange("image"),
    handleAudioChange: handleFileChange("audio"),
    isLoading,
  };
};
