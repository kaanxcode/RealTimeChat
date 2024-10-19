import ChatRoomHeader from "@/components/ChatRoomHeader";
import MessageList from "@/components/List/Message/MessageList";
import { chatRef } from "@/firebaseConfig";
import { sendMessage } from "@/redux/slices/chatSlice";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, TextInput, TouchableOpacity, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";

const ChatRoom = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { activeChatId, activeChatUser } = useSelector((state) => state.chat);
  const { userData } = useSelector((state) => state.user);
  const [text, setText] = useState("");
  const [chat, setChat] = useState();
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const unSub = onSnapshot(doc(chatRef, activeChatId), (res) => {
      setChat(res.data());
    });

    const KeyBoardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      updateScrollView
    );

    return () => {
      unSub();
      KeyBoardDidShowListener.remove();
    };
  }, [activeChatId]);

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    updateScrollView();
  }, [chat]);

  const handleSend = () => {
    try {
      if (!text) return console.log("Text is empty");
      if (!activeChatId) return console.log("Chat not found");
      if (!activeChatUser) return console.log("User not found");

      dispatch(sendMessage({ text, activeChatId, activeChatUser }));
    } catch (error) {
      console.log("ChatRoom.tsx in sendmessage", error);
    } finally {
      setText("");
    }
  };

  return (
    <View className="flex-1 bg-zinc-100">
      <ChatRoomHeader router={router} />

      <View className=" border-b border-zinc-300" />

      <View className="flex-1 bg-zinc-100">
        <MessageList
          scrollViewRef={scrollViewRef}
          chat={chat}
          currentUser={userData.id}
        />
      </View>

      <View className="bg-white pb-3 pt-3 rounded-t-2xl ">
        <View className="flex-row items-center bg-zinc-100 rounded-full p-2 m-2 ">
          <TextInput
            value={text}
            onChangeText={setText}
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
