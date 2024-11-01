import ChatRoomHeader from "@/components/Headers/ChatRoomHeader";
import MessageList from "@/components/List/Message/MessageList";
import { chatRef } from "@/firebaseConfig";
import useDocumentPicker from "@/hooks/useDocumentPicker";
import useImagePicker from "@/hooks/useImagePicker";
import useFileUpload from "@/hooks/useUploadFile";
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
  const [image, setImage] = useState({ uri: "", type: "" });
  const [document, setDocument] = useState({ uri: "", type: "" });
  const { pickImage } = useImagePicker();
  const { pickDocument } = useDocumentPicker();
  const { uploadFile } = useFileUpload();

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

  const handleSend = async () => {
    try {
      if (!text && !image.uri && !document.uri) {
        console.log("Mesaj boş");
        return;
      }

      let fileDownloadURL = "";
      setText("");
      setDocument({ uri: "", type: "" });
      setImage({ uri: "", type: "" });

      if (document.uri) {
        fileDownloadURL = await uploadFile(document.uri, document.type);
      }

      if (image.uri) {
        fileDownloadURL = await uploadFile(image.uri, image.type);
      }

      dispatch(
        sendMessage({
          text,
          activeChatId,
          activeChatUser,
          fileUrl: fileDownloadURL,
        })
      );
    } catch (error) {
      console.log("ChatRoom.tsx in sendmessage", error);
    } finally {
      setText("");
    }
  };

  const handlePickerImage = async () => {
    const result = await pickImage({ toast: false });
    if (result) {
      setImage({ uri: result.uri, type: result.type });
    } else {
      console.log("Resim seçimi yapılmadı.");
    }
  };

  const handlePickerDocument = async () => {
    const result = await pickDocument({ toast: false });
    if (result) {
      setDocument({ uri: result.uri, type: result.type });
    } else {
      console.log("Document yapılmadı.");
    }
  };

  return (
    <View className="flex-1 bg-zinc-100">
      <ChatRoomHeader router={router} />

      <View className="flex-1 bg-zinc-100">
        <MessageList
          scrollViewRef={scrollViewRef}
          chat={chat}
          currentUser={userData?.id}
        />
      </View>

      <View className="bg-white pb-3 pt-3 rounded-t-2xl">
        <View className="flex-row items-center bg-zinc-100 rounded-full p-2 m-2">
          <TextInput
            value={text}
            onChangeText={setText}
            className="flex-1 bg-zinc-100 px-2 py-1 rounded-full"
            placeholder="Mesaj yazın"
          />
          <TouchableOpacity
            disabled={document.uri ? true : false}
            onLongPress={() => setImage({ uri: "", type: "" })}
            onPress={handlePickerImage}
            className="ml-2 bg-zinc-100 p-2 rounded-full"
          >
            <Entypo
              name="image"
              size={18}
              color={image.uri ? "#3F51B5" : "gray"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={image.uri ? true : false}
            onLongPress={() => setDocument({ uri: "", type: "" })}
            onPress={handlePickerDocument}
            className="ml-2 bg-zinc-100 p-2 rounded-full"
          >
            <Entypo
              name="attachment"
              size={18}
              color={document.uri ? "#3F51B5" : "gray"}
            />
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
