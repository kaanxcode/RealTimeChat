import { useRouter } from "expo-router";
import React from "react";
import { Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AuthHeader = ({ title }) => {
  const ios = Platform.OS === "ios";
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      className="px-5  bg-indigo-500"
      style={{ paddingTop: ios ? top : top + 10, paddingBottom: 60 }}
    >
      <View className="flex flex-col items-start gap-6">
        <Text className=" text-3xl font-bold tracking-wider text-white">
          {title}
        </Text>
      </View>
    </View>
  );
};

export default AuthHeader;
