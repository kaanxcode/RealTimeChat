import { deleteChat } from "@/redux/slices/chatSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

const ChatRoomHeader = ({ router }) => {
  const dispatch = useDispatch();
  const { activeChatUser, activeChatId } = useSelector((state) => state.chat);

  const handleDeleteChat = async () => {
    try {
      Alert.alert(
        "DİKKAT SOHBET SİLİNİYOR",
        "Sohbeti silmek istediğinden emin misin? Bu işlem geri alınamaz.",
        [
          {
            text: "İPTAL",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "SOHBETİ SİL",
            onPress: async () => {
              try {
                const success = await dispatch(
                  deleteChat({
                    chatId: activeChatId,
                    activeUser: activeChatUser.id,
                  })
                ).unwrap();

                if (success) {
                  router.back(); // Başarılıysa geri dön
                } else {
                  Toast.show({
                    type: "error",
                    text1: "Hata",
                    text2: "Sohbet silinemedi.",
                  });
                }
              } catch (error) {
                console.log("Error deleting chat:", error);
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
    <Stack.Screen
      options={{
        title: "",
        headerShadowVisible: false,

        headerLeft: () => (
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </TouchableOpacity>

            <Image
              className="w-12 h-12 rounded-full ml-2"
              source={{ uri: activeChatUser?.profileImg }}
            />

            <View className="ml-2">
              <Text className="text-lg font-semibold text-black">
                {activeChatUser?.username}
              </Text>
              <Text className="text-sm text-gray-400">Online</Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={handleDeleteChat}>
              <Ionicons name="trash" size={24} color="black" />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
  );
};

export default ChatRoomHeader;
