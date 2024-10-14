import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Contacts = () => {
  return (
    <SafeAreaView className="flex-1">
      <View className="p-5">
        <View className="flex-1 justify-center items-start">
          <Image
            source={require("@/assets/images/profile.jpeg")}
            className="w-28 h-28 rounded-full"
          />
        </View>
        <View className="flex-1 justify-center items-center">
          <Text className="text-2xl font-bold">Ho</Text>
          <Text className="text-lg text-gray-500"></Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Contacts;
