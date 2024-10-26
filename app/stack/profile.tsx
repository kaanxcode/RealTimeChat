import LoadingComponent from "@/components/LoadingComponent";
import useImagePicker from "@/hooks/useImagePicker";
import useFileUpload from "@/hooks/useUploadFile";
import { deleteUser } from "@/redux/slices/authSlice";
import { updateUserData } from "@/redux/slices/userSlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userData, isLoading } = useSelector((state) => state.user);
  const { pickImage } = useImagePicker();
  const { uploadFile } = useFileUpload();

  const [showInput, setShowInput] = useState(false);
  const [username, setUsername] = useState("");

  const handleUdateProfileImage = async () => {
    try {
      const result = await pickImage({ toast: true });

      const profileImg = await uploadFile(result.uri, result.type);

      dispatch(updateUserData({ profileImg, field: "profileImg" })).unwrap();
      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: "Profil resminiz başarıyla güncellendi.",
      });
    } catch (error) {
      console.log("Profile page update user data error", error);
    }
  };

  const handleChangeUsername = async () => {
    try {
      if (username !== "") {
        const field = "username";
        await dispatch(updateUserData({ username, field })).unwrap();
        setShowInput(false);
        setUsername("");
      } else {
        Toast.show({
          type: "error",
          text1: "Hata",
          text2: "Kullanıcı adı boş olamaz.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Kullanıcı adı güncellenemedi.",
      });
    }
  };

  const handeDeleteUser = () => {
    Alert.alert(
      "Hesabınızı silmek istediğinize emin misiniz?",
      "Bu işlem geri alınamaz.",
      [
        {
          text: "Vazgeç",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Evet",
          onPress: async () => {
            await dispatch(deleteUser()).unwrap();
            router.replace("/login");
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center ">
        <LoadingComponent size={60} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 p-6 bg-white gap-10 justify-center">
        <View className="flex-1 items-center mb-6 justify-end">
          <Image
            source={{ uri: userData?.profileImg }}
            className="w-28 h-28 rounded-full"
          />
          <TouchableOpacity onPress={handleUdateProfileImage} className="mt-4">
            <Text className="text-indigo-500 text-lg font-medium">
              Profil resmini değiştir
            </Text>
          </TouchableOpacity>
        </View>

        <View className="gap-4">
          <View className="h-16 flex-row items-center px-4 bg-neutral-100 rounded-2xl">
            <Text className="text-xl font-medium text-zinc-600">
              {userData?.email}
            </Text>
          </View>

          {showInput ? (
            <View className="h-16 flex-row items-center justify-between px-4 bg-neutral-100 rounded-2xl">
              <TextInput
                placeholder=""
                className="flex-1 text-md font-semibold  text-zinc-900"
                placeholderTextColor={"gray"}
                value={username}
                onChangeText={(value) => setUsername(value)}
              />
              <TouchableOpacity onPress={handleChangeUsername}>
                <Feather name="send" size={24} color="gray" />
              </TouchableOpacity>
              <TouchableOpacity
                className="ml-4"
                onPress={() => setShowInput(false)}
              >
                <MaterialIcons name="cancel" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="h-16 flex-row items-center justify-between px-4 bg-neutral-100 rounded-2xl">
              <Text className="text-xl font-medium text-zinc-600">
                {userData?.username}
              </Text>
              <TouchableOpacity onPress={() => setShowInput(true)}>
                <Feather name="edit-3" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="flex-1 items-center justify-end">
          <TouchableOpacity
            onPress={handeDeleteUser}
            className="flex-row items-center"
          >
            <Text className="text-2xl font-bold text-red-500 mr-2">
              Hesabını Sil
            </Text>
            <AntDesign name="deleteuser" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
