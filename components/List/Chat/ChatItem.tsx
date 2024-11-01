import { setActiveChat } from "@/redux/slices/chatSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { dateFormatter } from "../../../utils/dateFormatter";

const ChatItem = ({ chat, onSelectChat }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);

  const newDate = dateFormatter(chat?.updatedAt / 1000);
  const isMyMessage = chat?.senderId === userData?.id;

  const handleOpenChatRoom = () => {
    onSelectChat(chat);
    router.push({
      pathname: "/stack/chat-room",
    });
    dispatch(setActiveChat(chat));
  };

  const renderMessageContent = () => {
    if (chat?.lastMessage) {
      return (
        <>
          <Text
            style={{
              color: isMyMessage ? "gary" : "black",
              fontWeight: isMyMessage ? "normal" : "bold",
            }}
            className="text-sm"
          >
            {chat.lastMessage.length > 30
              ? `${chat.lastMessage.substring(0, 30)}...`
              : chat.lastMessage}
          </Text>
        </>
      );
    } else if (chat?.attachment) {
      const attachmentType = chat.attachment.includes("image")
        ? "Fotoğraf"
        : chat.attachment.includes("document")
        ? "Dosya"
        : null;

      return (
        <>
          {attachmentType === "Fotoğraf" && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="image" size={14} color="gray" />
              <Text className="text-sm">{attachmentType}</Text>
            </View>
          )}
          {attachmentType === "Dosya" && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="attach" size={14} color="gray" />
              <Text className="text-sm">{attachmentType}</Text>
            </View>
          )}
        </>
      );
    } else {
      return <Text className="text-sm font-bold">Bir konuşma başlat!</Text>;
    }
  };

  return (
    <Pressable
      onPress={handleOpenChatRoom}
      className="bg-zinc-100 items-center mt-4"
    >
      <View className="bg-white w-11/12 rounded-3xl flex-row items-center p-4 gap-4">
        <Image
          className="w-16 h-16 rounded-full"
          source={{ uri: chat?.user?.profileImg }}
        />
        <View className="flex-1 flex-row justify-between items-center ">
          <View className="gap-1">
            <Text className="text-zinc-900 font-bold text-lg">
              {chat?.user?.username}
            </Text>
            <View className="flex-row items-center gap-1">
              {isMyMessage && (
                <Ionicons name="checkmark-done" size={14} color="gray" />
              )}
              {renderMessageContent()}
            </View>
          </View>

          <View className="items-center gap-2">
            <Text className="text-zinc-400 font-normal text-sm ">
              {newDate}
            </Text>
            {/* <View className="bg-indigo-500 rounded-full py-1 px-3 ">
              <Text className="text-white font-bold ">2</Text>
            </View> */}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ChatItem;
