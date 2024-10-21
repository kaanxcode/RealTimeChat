import React from "react";
import { FlatList, View } from "react-native";
import GroupChatItem from "./GroupChatItem";

const GroupChatList = ({ groupChats, onSelectGroupChat }) => {
  return (
    <View className="flex-1">
      <FlatList
        data={groupChats}
        keyExtractor={(item) => item.chatId}
        renderItem={({ item }) => (
          <GroupChatItem
            groupChat={item}
            onSelectGroupChat={onSelectGroupChat}
          />
        )}
      />
    </View>
  );
};

export default GroupChatList;
