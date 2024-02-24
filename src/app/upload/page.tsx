"use client";

import { useSession } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@src/utils/firebase";
import { upload_image_func } from "@src/utils/upload-func";

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

  async function handleUpload() {
    try {
      const downloadurl = await upload_image_func({
        selectedFile,
        email: session?.user?.email ?? "",
      });
      console.log(downloadurl);
      setDownloadURL(downloadurl);
    } catch (error) {
      console.log(error);
    }
  }
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
