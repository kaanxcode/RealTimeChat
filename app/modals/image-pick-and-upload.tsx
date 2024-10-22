import LoadingComponent from "@/components/LoadingComponent";
import useImagePicker from "@/hooks/useImagePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const { pickImage } = useImagePicker();

  const handleImageUpload = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const field = "profileImg";

      const imageUri = await pickImage({ toast: true });
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
