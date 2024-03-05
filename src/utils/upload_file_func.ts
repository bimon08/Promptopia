import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

interface UploadFileParams {
  file: File;
  userEmail: string;
  fileType: "image" | "audio";
}

export const upload_file_func = async ({
  file,
  userEmail,
  fileType,
}: UploadFileParams): Promise<string> => {
  if (!userEmail) throw new Error("User email is not provided.");
  if (!["image", "audio"].includes(fileType))
    throw new Error("Invalid file type.");

  const timestamp = new Date().getTime();
  const storagePath = `${fileType}s/${userEmail}/${timestamp}_${file.name}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};
