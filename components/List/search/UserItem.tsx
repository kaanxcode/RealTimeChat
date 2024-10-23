import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const UserItem = ({ user, onPress }) => {
  return (
    <View className="flex-1 bg-zinc-100  items-center  mt-4">
      <View className="bg-white w-11/12 rounded-3xl flex-row items-center p-4 gap-4">
        <Image
          className="w-16 h-16 rounded-full"
          source={{ uri: user?.profileImg }}
        />
        <View className="flex-row flex-1 justify-between items-center gap-10">
          <View className="gap-1">
            <Text className="text-zinc-900 font-bold text-lg">
              {user?.username.length > 20
                ? `${user?.username.substring(0, 20)}...`
                : user?.username}
            </Text>
            <Text className="text-zinc-400 font-light text-xs">
              {user?.email.length > 20
                ? `${user?.email.substring(0, 20)}...`
                : user?.email}
            </Text>
          </View>

          <TouchableOpacity
            onPress={onPress}
            className=" bg-indigo-500 rounded-full py-2 px-4 "
          >
            <Entypo name="new-message" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserItem;
