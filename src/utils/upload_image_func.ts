import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export const upload_image_func = async ({
  selectedFile,
  email,
  fileType,
}: {
  selectedFile: File | null;
  email: string;
  fileType?: string; // fileType indicates whether it's "image" or "audio"
}) => {
  if (!selectedFile) {
    throw new Error("No file selected");
  }
  try {
    if (email) {
      console.log(email);
      const timestamp = new Date().getTime();
      let storagePath;
      if (fileType === "image") {
        storagePath = `images/${email}/${timestamp}_${selectedFile.name}`;
      } else if (fileType === "audio") {
        storagePath = `audio/${email}/${timestamp}_${selectedFile.name}`;
      } else {
        throw new Error("Invalid file type");
      }
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("File uploaded successfully");
      return downloadURL;
    } else {
      throw new Error("User not available in session");
    }
  } catch (error: any) {
    throw error;
  }
};
