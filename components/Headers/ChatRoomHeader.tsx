import { deleteChat } from "@/redux/slices/chatSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

const ChatRoomHeader = ({ router }) => {
  const dispatch = useDispatch();
  const { activeChatUser, activeChatId } = useSelector((state) => state.chat);
  const { top } = useSafeAreaInsets();
  const ios = Platform.OS === "ios";

  const handleDeleteChat = async () => {
    try {
      Alert.alert(
        "DİKKAT SOHBET SİLİNİYOR",
        "Sohbeti silmek istediğinden emin misin? Bu işlem geri alınamaz.",
        [
          {
            text: "İPTAL",
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
                  router.back();
                } else {
                  Toast.show({
                    type: "error",
                    text1: "Hata",
                    text2: "Sohbet silinemedi.",
                  });
                }
              } catch (error) {
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
        header: () => (
          <View
            style={{
              paddingTop: ios ? top : top + 5,
            }}
            className="bg-indigo-500 flex-row justify-between items-center px-5 py-4 rounded-b-2xl"
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back-outline" size={24} color="white" />
              </TouchableOpacity>
              <Image
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  marginLeft: 8,
                }}
                source={{ uri: activeChatUser?.profileImg }}
              />
              <View style={{ marginLeft: 8 }}>
                <Text
                  style={{ fontSize: 18, fontWeight: "600", color: "white" }}
                >
                  {activeChatUser?.username}
                </Text>
              </View>
            </View>

            {/* Sağ kısım (headerRight) */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={handleDeleteChat}>
                <Ionicons name="trash" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ),
      }}
    />
  );
};

export default ChatRoomHeader;
