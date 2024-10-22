import { dateFormatter } from "@/utils/dateFormatter";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const GroupChatItem = ({ groupChat, onSelectGroupChat }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);

  const newDate = dateFormatter(groupChat?.updatedAt / 1000);
  const isMyMessage = groupChat?.senderId === userData?.id;

  const handleOpenGroupChatRoom = () => {
    onSelectGroupChat(groupChat);
    router.push({
      pathname: "/stack/group-room",
    });
  };

  const renderMessageContent = () => {
    if (groupChat?.lastMessage) {
      return (
        <>
          <Text
            style={{
              color: isMyMessage ? "gary" : "black",
              fontWeight: isMyMessage ? "normal" : "bold",
            }}
            className="text-sm"
          >
            {groupChat.lastMessage}
          </Text>
        </>
      );
    } else if (groupChat?.attachment) {
      const attachmentType = groupChat.attachment.includes("image")
        ? "Fotoğraf"
        : groupChat.attachment.includes("document")
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
      onPress={handleOpenGroupChatRoom}
      className="bg-zinc-100 items-center mt-4"
    >
      <View className="bg-white w-11/12 rounded-3xl flex-row items-center p-4 gap-4">
        <Image
          className="w-16 h-16 rounded-full"
          source={{ uri: groupChat?.groupImage }}
        />
        <View className="flex-1 flex-row justify-between items-center ">
          <View className="gap-1">
            <Text className="text-zinc-900 font-bold text-lg">
              {groupChat?.groupName}
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
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default GroupChatItem;
