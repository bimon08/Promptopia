import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export const upload_image_func = async ({
  selectedFile,
  email,
}: {
  selectedFile: File | null;
  email: string;
}) => {
  if (!selectedFile) {
    throw new Error("No file selected");
  }
  try {
    if (email) {
      console.log(email);
      const timestamp = new Date().getTime();
      const storageRef = ref(
        storage,
        `images/${email}/${timestamp}_${selectedFile.name}`,
      );
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
