import GroupRoomHeader from "@/components/GroupRoomHeader";
import GroupMessageList from "@/components/List/Group/GroupMessage/GroupMessageList";
import { chatRef, db } from "@/firebaseConfig";
import { sendMessageGroup } from "@/redux/slices/groupChatSlice";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, TextInput, TouchableOpacity, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";

const GroupRoom = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { activeGroupChatId, activeGroupChatParticipants } = useSelector(
    (state) => state.groupChat
  );
  const { userData } = useSelector((state) => state.user);
  const [text, setText] = useState("");
  const [chat, setChat] = useState();
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const unSub = onSnapshot(doc(chatRef, activeGroupChatId), async (res) => {
      const messages = res.data().messages;

      const updatedMessages = await Promise.all(
        messages.map(async (message) => {
          const userDoc = await getDoc(doc(db, "users", message.senderId));
          if (userDoc.exists()) {
            const username = userDoc.data().username;
            return {
              ...message,
              username,
            };
          } else {
            return message;
          }
        })
      );

      setChat(updatedMessages);
    });

    const KeyBoardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      updateScrollView
    );

    return () => {
      unSub();
      KeyBoardDidShowListener.remove();
    };
  }, [activeGroupChatId]);

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
      if (!activeGroupChatId) return console.log("Chat not found");
      if (!activeGroupChatParticipants)
        return console.log("Participants not found");
      dispatch(
        sendMessageGroup({
          text,
          activeGroupChatId,
          participants: activeGroupChatParticipants,
        })
      );
    } catch (error) {
      console.log("Group Room.tsx in sendMessageGroup", error);
    } finally {
      setText("");
    }
  };

  return (
    <View className="flex-1 bg-zinc-100">
      <GroupRoomHeader router={router} />

      <View className=" border-b border-zinc-300" />

      <View className="flex-1 bg-zinc-100">
        <GroupMessageList
          scrollViewRef={scrollViewRef}
          chat={chat}
          currentUser={userData?.id}
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

export default GroupRoom;
