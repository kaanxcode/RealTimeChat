import { deleteGroupChat } from "@/redux/slices/groupChatSlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

const DeleteGroup = ({ chatId, participants }) => {
  const dipatch = useDispatch();
  const router = useRouter();
  const handeleDeleteGroup = async () => {
    try {
      Alert.alert(
        "DİKKAT GRUP SİLİNİYOR",
        "Grubu silmek istediğinden emin misin? Bu işlem geri alınamaz.",
        [
          {
            text: "İPTAL",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "GRUBU SİL",
            onPress: async () => {
              try {
                const success = await dipatch(
                  deleteGroupChat({ chatId, participants })
                ).unwrap();

                if (success) {
                  router.replace("/(tabs)/groups");
                } else {
                  Toast.show({
                    type: "error",
                    text1: "Hata",
                    text2: "Grup silinemedi.",
                  });
                }
              } catch (error) {
                console.log("Error deleting group:", error);
                Toast.show({
                  type: "error",
                  text1: "Hata",
                  text2: "Bir hata oluştu.",
                });
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log("Error in Alert:", error);
    }
  };

  return (
    <TouchableOpacity onPress={handeleDeleteGroup} className="">
      <View className="flex-row items-center gap-2 ">
        <Text className="text-red-500 text-xl ">Grubu Sil</Text>
        <AntDesign name="deleteusergroup" size={20} color="red" />
      </View>
    </TouchableOpacity>
  );
};

export default DeleteGroup;
