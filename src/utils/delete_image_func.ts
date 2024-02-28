import { ref, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export const delete_image_func = async ({
  fileName,
  email,
}: {
  fileName: string;
  email: string;
}) => {
  try {
    const storageRef = ref(storage, `images/${email}/${fileName}`);
    await deleteObject(storageRef);
    console.log("File deleted successfully");
  } catch (error: any) {
    throw error;
  }
};
