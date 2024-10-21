import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import Toast from "react-native-toast-message";

const useImagePicker = () => {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
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
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        return result.assets[0].uri;
      } else {
        Toast.show({
          type: "info",
          text1: "Bilgi",
          text2: "Herhangi bir resim seçilmedi.",
        });
        return;
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: error.toString(),
      });
    }
  };
  const resetImage = () => setImageUri(null);

  return { imageUri, pickImage, resetImage };
};

export default useImagePicker;
