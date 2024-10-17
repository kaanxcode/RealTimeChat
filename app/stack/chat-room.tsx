import ChatRoomHeader from "@/components/ChatRoomHeader";
import MessageList from "@/components/List/Message/MessageList";
import { db } from "@/firebaseConfig";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

const ChatRoom = () => {
  const item = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState(""); // Message input state
  const [chat, setChat] = useState(); // Message input state

  const handleSend = () => {
    console.log("Send message", message);
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", item.chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unsub();
    };
  }, []);

  console.log("Chat", chat);

  return (
    <View className="flex-1 bg-zinc-100">
      <ChatRoomHeader router={router} item={item} />

      <View className=" border-b border-zinc-300" />

      <View className="flex-1 bg-zinc-100">
        <MessageList />
      </View>

      <View className="bg-white pb-3 pt-3 rounded-t-2xl ">
        <View className="flex-row items-center bg-zinc-100 rounded-full p-2 m-2 ">
          <TextInput
            value={message}
            onChangeText={setMessage}
            className="flex-1 bg-zinc-100 px-2 py-1 rounded-full"
            placeholder="Type a message"
          />

          <TouchableOpacity className="ml-2 bg-zinc-100 p-2 rounded-full">
            <Entypo name="attachment" size={18} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            className="ml-2 bg-zinc-100 p-2 rounded-full"
            onPress={handleSend}
          >
            <Feather name="send" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatRoom;
