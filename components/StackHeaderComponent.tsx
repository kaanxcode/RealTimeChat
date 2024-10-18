import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const StackHeaderComponent = ({ title }) => {
  const ios = Platform.OS === "ios";
  const { top } = useSafeAreaInsets();

  const router = useRouter();

  return (
    <View
      className="flex-row justify-between items-center px-5 py-4 bg-indigo-500 rounded-[28px] mx-2"
      style={{ marginTop: ios ? top : top + 10 }}
    >
      <Pressable onPress={() => router.back()} className="mr-auto">
        <Ionicons name="arrow-back-outline" size={24} color="white" />
      </Pressable>
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold tracking-wider text-white">
          {title}
        </Text>
      </View>
    </View>
  );
};

export default StackHeaderComponent;
