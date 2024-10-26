import { dateFormatter } from "@/utils/dateFormatter";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";

const MessageItem = ({ chat, currentUser }) => {
  const isCurrentUser = chat.senderId === currentUser;
  const messageTime = dateFormatter(chat.createdAt.seconds);

  const getFileType = (fileUrl) => {
    if (fileUrl.includes("document")) {
      return "pdf";
    } else if (fileUrl.includes("image")) {
      return "image";
    }
    return null;
  };

  const fileType = chat.fileUrl ? getFileType(chat.fileUrl) : null;

  if (isCurrentUser) {
    return (
      <View className="flex-row justify-end my-1">
        <View>
          <View className="p-4 bg-indigo-500 rounded-t-3xl rounded-bl-3xl gap-2">
            {fileType === "pdf" && (
              <TouchableOpacity onPress={() => Linking.openURL(chat.fileUrl)}>
                <MaterialIcons name="file-open" size={48} color="white" />
              </TouchableOpacity>
            )}
            {fileType === "image" && (
              <TouchableOpacity
                className=""
                onPress={() => Linking.openURL(chat.fileUrl)}
              >
                <Image
                  source={{ uri: chat.fileUrl }}
                  className="w-48 h-48 rounded-xl"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
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
          <View className="p-4 bg-white rounded-t-3xl rounded-br-3xl gap-2">
            {fileType === "pdf" && (
              <TouchableOpacity
                className="mb-2"
                onPress={() => Linking.openURL(chat.fileUrl)}
              >
                <MaterialIcons name="file-open" size={48} color="black" />
              </TouchableOpacity>
            )}
            {fileType === "image" && (
              <TouchableOpacity
                className=""
                onPress={() => Linking.openURL(chat.fileUrl)}
              >
                <Image
                  source={{ uri: chat.fileUrl }}
                  className="w-48 h-48 rounded-xl"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
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
