"use client";

import { useSession } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@src/utils/firebase";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    setUploadError(null);

    try {
      if (session?.user && session.user.email) {
        const timestamp = new Date().getTime();
        const storageRef = ref(
          storage,
          `images/${session.user.email}/${timestamp}_${selectedFile.name}`,
        );
        await uploadBytes(storageRef, selectedFile);

        const downloadURL = await getDownloadURL(storageRef);
        setDownloadURL(downloadURL);

        // File uploaded successfully
        console.log("File uploaded successfully");
      } else {
        throw new Error("User not available in session");
      }
    } catch (error: any) {
      console.error(error);
      setUploadError(error.message);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
      {downloadURL && (
        <div>
          <p>File uploaded successfully:</p>
          <a href={downloadURL} target="_blank" rel="noopener noreferrer">
            {downloadURL}
          </a>
        </div>
      )}
    </div>
  );
};

export default Upload;
