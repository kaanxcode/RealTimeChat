import React from "react";
import { FlatList, View } from "react-native";
import ChatItem from "./ChatItem";

const ChatList = ({ chats, onSelectChat }) => {
  return (
    <View className="flex-1">
      <FlatList
        data={chats}
        keyExtractor={(item) => item.chatId}
        renderItem={({ item }) => (
          <ChatItem chat={item} onSelectChat={onSelectChat} />
        )}
      />
    </View>
  );
};

export default ChatList;
