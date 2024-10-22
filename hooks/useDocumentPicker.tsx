import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";

const useDocumentPicker = () => {
  const pickDocument = async ({ toast }) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return { uri: asset.uri, type: asset.mimeType };
      } else {
        if (!toast) {
          console.log("Resim seçimi iptal edildi.");
          return { uri: "", type: "" };
        } else {
          Toast.show({
            type: "info",
            text1: "Bilgi",
            text2: "Herhangi bir resim seçilmedi.",
          });
        }
        return null;
      }
    } catch (error) {
      console.log("ImagePicker error:", error);
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: error.toString(),
      });
      return null;
    }
  };

  return { pickDocument };
};

export default useDocumentPicker;
