import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const GroupUserItem = ({ user, isSelected, onPress }) => {
  return (
    <View className="flex-1 bg-zinc-100  items-center mt-4">
      <View className="bg-white w-11/12 rounded-3xl flex-row items-center p-4 gap-4">
        <Image
          className="w-16 h-16 rounded-full"
          source={{ uri: user?.profileImg }}
        />
        <View className="flex-1 flex-row justify-between items-center gap-10">
          <Text className="text-zinc-900 font-bold text-lg">
            {user?.username}
          </Text>

          <TouchableOpacity
            onPress={onPress}
            className={`${
              isSelected ? "bg-green-500" : "bg-indigo-500"
            } rounded-full py-2 px-4`}
          >
            <Text className="text-white text-center">
              {isSelected ? "Seçildi" : "Gruba Ekle"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GroupUserItem;
