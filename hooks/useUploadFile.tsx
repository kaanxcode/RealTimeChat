import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";

const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");

  const uploadFile = async (uri, fileType) => {
    setUploading(true);

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `uploads/${Date.now()}.${
        fileType === "image" ? "image" : "document"
      }`;
      const storageRef = ref(getStorage(), fileName);

      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setDownloadURL(downloadURL);
      return downloadURL;
    } catch (err) {
      console.log("Error uploading file:", err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, downloadURL };
};

export default useFileUpload;
