import React from "react";
import { FlatList, View } from "react-native";
import UserItem from "./UserItem";

const UserList = ({ users, onPress }) => {
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserItem user={item} onPress={() => onPress(item)} />
        )}
      />
    </View>
  );
};

export default UserList;
