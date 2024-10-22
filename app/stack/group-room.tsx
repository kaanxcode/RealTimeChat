import GroupRoomHeader from "@/components/GroupRoomHeader";
import GroupMessageList from "@/components/List/Group/GroupMessage/GroupMessageList";
import { chatRef, db } from "@/firebaseConfig";
import useDocumentPicker from "@/hooks/useDocumentPicker";
import useImagePicker from "@/hooks/useImagePicker";
import useFileUpload from "@/hooks/useUploadFile";
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
  const { uploadFile, downloadURL } = useFileUpload();
  const { pickImage } = useImagePicker();
  const { pickDocument } = useDocumentPicker();
  const { activeGroupChatId, activeGroupChatParticipants } = useSelector(
    (state) => state.groupChat
  );
  const { userData } = useSelector((state) => state.user);

  const [text, setText] = useState("");
  const [image, setImage] = useState({ uri: "", type: "" });
  const [document, setDocument] = useState({ uri: "", type: "" });
  const [chat, setChat] = useState([]);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const unSub = onSnapshot(doc(chatRef, activeGroupChatId), async (res) => {
      const messages = res.data()?.messages || [];
      const updatedMessages = await Promise.all(
        messages.map(async (message) => {
          const userDoc = await getDoc(doc(db, "users", message.senderId));
          const username = userDoc.exists() ? userDoc.data().username : null;
          return { ...message, username };
        })
      );
      setChat(updatedMessages);
    });

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      updateScrollView
    );

    return () => {
      unSub();
      keyboardDidShowListener.remove();
    };
  }, [activeGroupChatId]);

  useEffect(() => {
    updateScrollView();
  }, [chat]);

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = async () => {
    try {
      if (!text && !image.uri && !document.uri) {
        console.log("Mesaj boş");
        return;
      }
      if (!activeGroupChatId) {
        console.log("Sohbet bulunamadı");
        return;
      }
      if (!activeGroupChatParticipants) {
        console.log("Katılımcılar bulunamadı");
        return;
      }

      let fileDownloadURL = "";
      setText("");
      setDocument({ uri: "", type: "" });
      setImage({ uri: "", type: "" });

      if (document.uri) {
        fileDownloadURL = await uploadFile(document.uri, document.type);
        console.log("Document uploaded:", document, "URL:", fileDownloadURL);
      }

      if (image.uri) {
        fileDownloadURL = await uploadFile(image.uri, image.type);
        console.log("Image uploaded:", image, "URL:", fileDownloadURL);
      }

      await dispatch(
        sendMessageGroup({
          text,
          activeGroupChatId,
          participants: activeGroupChatParticipants,
          fileUrl: fileDownloadURL,
        })
      );
    } catch (error) {
      console.log("Mesaj gönderme sırasında hata oluştu:", error);
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
      <GroupRoomHeader router={router} />
      <View className="border-b border-zinc-300" />

      <View className="flex-1 bg-zinc-100">
        <GroupMessageList
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
              color={image.uri ? "indigo" : "gray"}
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
              color={document.uri ? "indigo" : "gray"}
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

export default GroupRoom;
