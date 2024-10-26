import GroupUserList from "@/components/List/Group/GroupSearch/GroupUserList";
import LoadingComponent from "@/components/LoadingComponent";
import useImagePicker from "@/hooks/useImagePicker";
import useFileUpload from "@/hooks/useUploadFile";
import { fetchUsers } from "@/redux/slices/addUsersSlice";
import { addGroupChat } from "@/redux/slices/groupChatSlice";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

const CreateGroup = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { users, isLoading: addUsersLoading } = useSelector(
    (state) => state.addUsers
  );
  const { userData } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.groupChat);

  const { pickImage } = useImagePicker();
  const { uploadFile } = useFileUpload();
  const [groupName, setGroupName] = useState("");
  const [image, setImage] = useState({ uri: "", type: "" });
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    try {
      dispatch(fetchUsers()).unwrap();
    } catch (error) {
      console.log("create-group error fetching users:", error);
    }
  }, [dispatch]);

  const handleSelectImage = async () => {
    try {
      let result = await pickImage({ toast: true });
      setImage({ uri: result.uri, type: result.type });
    } catch (error) {
      console.log("Create-group error selecting image:", error);
    }
  };

  const handleUserSelect = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreatingGroupChat = async () => {
    if (selectedUsers.length >= 2) {
      try {
        if (!image.uri) {
          Toast.show({
            type: "error",
            text1: "Hata",
            text2: "Bir resim seçmelisiniz.",
          });
          return;
        }
        const downloadURL = await uploadFile(image.uri, image.type);
        if (!groupName) {
          Toast.show({
            type: "error",
            text1: "Hata",
            text2: "Grup ismi girmelisiniz.",
          });
          return;
        }
        await dispatch(
          addGroupChat({ selectedUsers, groupImage: downloadURL, groupName })
        ).unwrap();
      } catch (error) {
        console.log("Error creating group chat:", error);
      } finally {
        if (image.uri && groupName) {
          setSelectedUsers([]);
          setGroupName("");
          setImage({ uri: "", type: "" });
          router.back();
        }
      }
    }
  };

  if (isLoading || addUsersLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-zinc-100">
        <LoadingComponent size={60} />
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <SafeAreaView className="flex-1 pt-20 bg-zinc-100 justify-center items-center ">
        <Text className="text-3xl font-bold">No users found</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-zinc-100 pt-2">
      <View className="flex-row justify-start items-center gap-2 mx-2">
        <TouchableOpacity onPress={handleSelectImage}>
          <Image
            source={
              image.uri
                ? { uri: image.uri }
                : require("../../assets/images/imageplus.jpg")
            }
            className="w-12 h-12 rounded-full "
          />
        </TouchableOpacity>
        <View className="flex-1 h-12 flex-row gap-4 px-4 bg-neutral-200 items-center rounded-2xl">
          <TextInput
            placeholder="Grup ismi giriniz"
            className="flex-1 text-md font-semibold text-naturel-700"
            onChangeText={setGroupName}
            value={groupName}
          />
        </View>
      </View>

      <GroupUserList
        users={users}
        selectedUsers={selectedUsers}
        onPress={handleUserSelect}
      />
      {selectedUsers.length >= 2 && (
        <TouchableOpacity
          onPress={handleCreatingGroupChat}
          className="bg-indigo-500 py-4 px-6 rounded-full m-4"
        >
          <Text className="text-white text-center text-lg">Grup Oluştur</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CreateGroup;
