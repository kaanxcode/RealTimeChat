import UserList from "@/components/List/Search/UserList";
import LoadingComponent from "@/components/LoadingComponent";
import { db, usersRef } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const querySnapshot = await getDocs(usersRef);

        let data = [];

        querySnapshot.forEach((doc) => {
          if (doc.id !== userId) {
            data.push({ id: doc.id, ...doc.data() });
          }
        });

        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-zinc-100">
        <LoadingComponent size={60} />
      </SafeAreaView>
    );
  }

  if (users.length === 0) {
    return (
      <SafeAreaView className="flex-1 pt-20 bg-zinc-100">
        <Text className="text-3xl font-bold">No users found</Text>
      </SafeAreaView>
    );
  }

  // handleSendMessage fonksiyonunu parametreli hale getiriyoruz
  const handleSendMessage = async (selectedUser) => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userChats");
    const userId = await AsyncStorage.getItem("userId");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // Seçilen kullanıcıya göre işlem yapıyoruz
      await updateDoc(doc(userChatsRef, selectedUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: userId,
          updateAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, userId), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: selectedUser.id,
          updateAt: Date.now(),
        }),
      });
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  return (
    <View className="flex-1 bg-zinc-100">
      <UserList users={users} onPress={handleSendMessage} />
    </View>
  );
};

export default Search;
