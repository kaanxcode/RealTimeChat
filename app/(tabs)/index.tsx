import ChatList from "@/components/List/Chat/ChatList";
import LoadingComponent from "@/components/LoadingComponent";
import PlusButtonComponent from "@/components/PlusButtonComponent";
import { db } from "@/firebaseConfig";
import { setChat } from "@/redux/slices/chatSlice"; // Chat actions import edin
import { fetchUserData } from "@/redux/slices/userSlice";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const Chats = () => {
  const { userData, isLoading, errorMessage } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const [chats, setChats] = useState([]); // Sohbetleri tutacak state

  // Kullanıcı verisini Redux ile çek
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  // Firestore'dan kullanıcının sohbetlerini dinle
  useEffect(() => {
    if (userData?.id) {
      const unsub = onSnapshot(
        doc(db, "userChats", userData.id),
        async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const chatData = docSnapshot.data().chats || [];

            // Sohbetlerdeki her kişinin bilgilerini çek
            const chatsWithUserDetails = await Promise.all(
              chatData.map(async (chat) => {
                const userDoc = await getDoc(doc(db, "users", chat.receiverId));
                if (userDoc.exists()) {
                  const user = userDoc.data();
                  return { ...chat, user }; // Her sohbetin kullanıcı bilgilerini ekle
                }
                return chat;
              })
            );

            // Sohbetleri son güncelleme tarihine göre sıralıyoruz
            const sortedChats = chatsWithUserDetails.sort(
              (a, b) => b.updatedAt - a.updatedAt
            );
            setChats(sortedChats);
          }
        }
      );

      return () => unsub(); // Dinleyiciyi bileşen kapatıldığında temizle
    }
  }, [userData]);

  // Kullanıcı bir sohbete tıkladığında çağrılan fonksiyon
  const handleSelectChat = (chat) => {
    dispatch(setChat({ chatId: chat.id, user: chat.user })); // Redux'ta sohbeti güncelle
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <LoadingComponent size={60} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-100">
      <ChatList chats={chats} onSelectChat={handleSelectChat} />
      <PlusButtonComponent />
    </View>
  );
};

export default Chats;
