import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const GroupRoomHeader = ({ router }) => {
  const { activeGroupChatId, activeGroupChatImage, activeGroupChatName } =
    useSelector((state) => state.groupChat);
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
              source={{ uri: activeGroupChatImage }}
            />

            <View className="ml-2">
              <Text className="text-lg font-semibold text-black">
                {activeGroupChatName}
              </Text>
              <Text className="text-sm text-gray-400">Online</Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={() => router.push("/modals/group-info")}>
              <Feather name="info" size={24} color="black" />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
  );
};

export default GroupRoomHeader;
