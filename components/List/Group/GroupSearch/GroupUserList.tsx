import React from "react";
import { FlatList, View } from "react-native";
import GroupUserItem from "./GroupUserItem";

const GroupUserList = ({ users, selectedUsers, onPress }) => {
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupUserItem
            user={item}
            isSelected={selectedUsers.some((u) => u.id === item.id)}
            onPress={() => onPress(item)}
          />
        )}
      />
    </View>
  );
};

export default GroupUserList;
