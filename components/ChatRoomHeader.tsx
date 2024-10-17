import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const ChatRoomHeader = ({ router, item }) => {
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
              source={{ uri: item.profileImg }}
            />

            <View className="ml-2">
              <Text className="text-lg font-semibold text-black">
                {item.username}
              </Text>
              <Text className="text-sm text-gray-400">Online</Text>
            </View>
          </View>
        ),
      }}
    />
  );
};

export default ChatRoomHeader;