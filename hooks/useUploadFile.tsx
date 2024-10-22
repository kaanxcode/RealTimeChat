import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const useFileUpload = () => {
  const uploadFile = async (uri, fileType) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `uploads/${Date.now()}.${
        fileType === "image" ? "image" : "document"
      }`;
      const storageRef = ref(getStorage(), fileName);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (err) {
      console.log("Error uploading file:", err);
      return null;
    }
  };

  return { uploadFile };
};

export default useFileUpload;
