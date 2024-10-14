import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { updateUsername } from "@/redux/slices/userSlice";
import LoadingComponent from "@/components/LoadingComponent";

const Profile = () => {
  const dispatch = useDispatch();
  const { userData, isLoading, errorMessage } = useSelector(
    (state) => state.user
  );

  const [showInput, setShowInput] = useState(false);
  const [username, setUsername] = useState("");

  const handleChangeProfileImage = () => {
    console.log("change profile image");
  };

  const handleChangeUsername = async () => {
    try {
      if (username !== "") {
        await dispatch(updateUsername({ username })).unwrap();
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
    console.log("delete user");
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <LoadingComponent size={60} />
      </View>
    );
  }

  return (
    <View className="flex-1 p-6 bg-white gap-10 justify-center">
      <View className="flex-1 items-center mb-6 justify-end">
        <Image
          source={{ uri: userData?.profileImg }}
          className="w-28 h-28 rounded-full"
        />
        <TouchableOpacity onPress={handleChangeProfileImage} className="mt-4">
          <Text className="text-indigo-500 text-lg font-medium">
            Profil resmini değiştir
          </Text>
        </TouchableOpacity>
      </View>

      <View className="gap-4">
        <View className="h-16 flex-row items-center px-4 bg-neutral-100 rounded-2xl">
          <Text className="text-xl font-medium text-zinc-600">
            {userData.email}
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
              {userData.username}
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
  );
};

export default Profile;
