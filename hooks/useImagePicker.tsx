import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

const useImagePicker = () => {
  const pickImage = async ({ toast }) => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Galeriye erişim izni gerekli!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        return { uri: asset.uri, type: asset.type };
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

  return { pickImage };
};

export default useImagePicker;
