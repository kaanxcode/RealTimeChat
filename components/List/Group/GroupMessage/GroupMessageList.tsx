import React from "react";
import { ScrollView } from "react-native";
import MessageItem from "./GroupMessageItem";

const GroupMessageList = ({ scrollViewRef, chat, currentUser }) => {
  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      className="flex-1 px-2"
    >
      {chat?.map((message, index) => (
        <MessageItem key={index} chat={message} currentUser={currentUser} />
      ))}
    </ScrollView>
  );
};

export default GroupMessageList;
