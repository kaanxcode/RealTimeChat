import LoadingComponent from "@/components/LoadingComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfilePicture,
  updateUserData,
} from "../../redux/slices/userSlice";

const ImagePickerAndUpload = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userData, isLoading } = useSelector((state) => state.user);

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

  const handleImageUpload = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const field = "profileImg";

      const imageUri = await pickImage();
      if (!imageUri) return;

      const profileImg = await dispatch(
        updateProfilePicture({ userId, imageUri })
      ).unwrap();

      await dispatch(updateUserData({ userId, profileImg, field })).unwrap();
      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: "Profil resminiz başarıyla güncellendi.",
      });
      router.back();
    } catch (error) {
      console.log("error", error);
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: error.toString(),
      });
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center ">
        <LoadingComponent size={60} />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center gap-10">
      <Text className="text-2xl color-zinc-600 ">Profil Resmi Yükle</Text>
      <Image source={{ uri: userData?.profileImg }} className="w-48 h-48" />

      <TouchableOpacity
        className="bg-indigo-500 py-3 rounded-lg h-17 w-3/4 "
        onPress={handleImageUpload}
      >
        <Text className="text-white text-center text-2xl font-semibold">
          SEÇ VE YÜKLE
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImagePickerAndUpload;
