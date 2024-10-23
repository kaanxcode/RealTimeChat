import AntDesign from "@expo/vector-icons/AntDesign";
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
            className={`flex-row justify-between items-center p-4 my-2 rounded-md 
             
            `}
            onPress={onPress}
          >
            {isSelected ? (
              <AntDesign name="checkcircle" size={24} color="green" />
            ) : (
              <AntDesign name="pluscircle" size={24} color="#3F51B5" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GroupUserItem;
