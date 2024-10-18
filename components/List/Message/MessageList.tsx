import React from "react";
import { ScrollView } from "react-native";
import MessageItem from "./MessageItem";

const MessageList = ({ scrollViewRef, chat, currentUser }) => {
  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      className="flex-1 px-2"
    >
      {chat?.messages?.map((message, index) => (
        <MessageItem key={index} chat={message} currentUser={currentUser} />
      ))}
    </ScrollView>
  );
};

export default MessageList;
