import React from "react";
import { FlatList, View } from "react-native";
import UserListItem from "./UserItem.tsx";

const UserList = ({ users, onPress }) => {
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        // Correctly pass the function to onPress
        renderItem={({ item }) => (
          <UserListItem
            user={item}
            onPress={() => onPress(item)} // Pass function that will be executed on press
          />
        )}
      />
    </View>
  );
};

export default UserList;
