import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const PlusButtonComponent = () => {
  const router = useRouter();
  return (
    <View className="absolute bottom-5 right-5 wbg-white rounded-full shadow-md">
      <TouchableOpacity
        className="bg-indigo-500 py-3 px-4 rounded-full"
        onPress={() => router.push("/modals/search")}
      >
        <FontAwesome5 name="plus" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default PlusButtonComponent;
