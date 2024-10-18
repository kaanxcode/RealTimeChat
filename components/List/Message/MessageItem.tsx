import { dateFormatter } from "@/utils/dateFormatter";
import React from "react";
import { Text, View } from "react-native";

const MessageItem = ({ chat, currentUser }) => {
  const isCurrentUser = chat.senderId === currentUser;

  const messageTime = dateFormatter(chat.createdAt.seconds);

  if (isCurrentUser) {
    return (
      <View className="flex-row justify-end my-1">
        <View>
          <View className="p-4 bg-indigo-500 rounded-t-3xl rounded-bl-3xl">
            <Text className="text-white">{chat.text}</Text>
          </View>
          <Text className="text-zinc-500 text-xs mt-1 pl-1 text-left">
            {messageTime}
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <View className="flex-row justify-start my-1">
        <View>
          <View className="p-4 bg-white rounded-t-3xl rounded-br-3xl">
            <Text className="text-zinc-900">{chat.text}</Text>
          </View>
          <Text className="text-zinc-500 text-xs mt-1 pl-1 text-right">
            {messageTime}
          </Text>
        </View>
      </View>
    );
  }
};

export default MessageItem;
