import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { dateFormatter } from "../../../utils/dateFormatter";

const ChatItem = ({ chat, onSelectChat }) => {
  const router = useRouter();

  const newDate = dateFormatter(chat.updateAt);

  const handleopenChatRoom = () => {
    onSelectChat(chat); // Seçilen sohbeti gönderiyoruz
    router.push({
      pathname: "/stack/chat-room",
      params: {
        chatId: chat.chatId,
        username: chat.user.username,
        profileImg: chat.user.profileImg,
      },
    }); // Sohbet ID'sini yönlendirme parametreleri ile gönderiyoruz
  };

  return (
    <Pressable
      onPress={handleopenChatRoom}
      className="bg-zinc-100 items-center mt-4"
    >
      <View className="bg-white w-11/12 rounded-3xl flex-row items-center p-4 gap-4">
        <Image
          className="w-16 h-16 rounded-full"
          source={{ uri: chat.user.profileImg }}
        />
        <View className="flex-1 flex-row justify-between items-center ">
          <View className="gap-1">
            <Text className="text-zinc-900 font-bold text-lg">
              {chat.user.username}
            </Text>
            <View className="flex-row items-center gap-1">
              <Ionicons name="checkmark-done" size={14} color="gray" />
              <Text className="text-zinc-400 font-normal text-sm ">
                {chat.lastMessage || "Last Message"}
              </Text>
            </View>
          </View>

          <View className="items-center gap-2">
            <Text className="text-zinc-400 font-normal text-sm ">
              {newDate}
            </Text>
            <View className="bg-indigo-500 rounded-full py-1 px-3 ">
              <Text className="text-white font-bold ">2</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ChatItem;
