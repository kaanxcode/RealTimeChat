import ChatRoomHeader from "@/components/ChatRoomHeader";
import MessageList from "@/components/List/Message/MessageList";
import { db } from "@/firebaseConfig";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, TextInput, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const ChatRoom = () => {
  const item = useLocalSearchParams();
  const { chatId, user } = useSelector((state) => state.chat);
  const { userData } = useSelector((state) => state.user);
  const router = useRouter();
  const [text, setText] = useState("");
  const [chat, setChat] = useState();
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
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
  }, [chatId]);

  useEffect(() => {
    updateScrollView();
  }, [chat]);

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = async () => {
    if (text === "") return;

    //let imgUrl = null;

    try {
      //   if (img.file) {
      //     imgUrl = await upload(img.file);
      //   }
      const userId = await AsyncStorage.getItem("userId");
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: userId,
          text,
          createdAt: new Date(),
          //   ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [userId, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userChats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].senderId = userId;
          userChatsData.chats[chatIndex].isSeen = id === userId ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      //   setImg({
      //     file: null,
      //     url: "",
      //   });r

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
