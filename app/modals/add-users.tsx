import UserList from "@/components/List/search/UserList";
import LoadingComponent from "@/components/LoadingComponent";
import { addChats, fetchUsers } from "@/redux/slices/addUsersSlice";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView, StatusBar, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const AddUsers = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.addUsers);
  const { chats, isLoading: chatsLoading } = useSelector((state) => state.chat);

  useEffect(() => {
    try {
      dispatch(fetchUsers()).unwrap();
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  }, [dispatch]);

  const handleCreatingChat = async (selectedUser) => {
    try {
      await dispatch(addChats({ selectedUser })).unwrap();
      router.back();
    } catch (error) {
      console.log("Error creating chat:", error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-zinc-100">
        <LoadingComponent size={60} />
      </SafeAreaView>
    );
  }
  if (users.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-zinc-100">
        <Text className="text-xl text-red-500 font-medium">
          Kullanıcı bulunamadı
        </Text>
      </SafeAreaView>
    );
  }

  // Kullanıcıların ID'leri ile karşılaştırma yap
  const chatUserIds = new Set(chats.map((chat) => chat.user.id));
  const filteredUsers = users.filter((user) => !chatUserIds.has(user.id));

  if (filteredUsers.length === 0 && users.length > 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-zinc-100">
        <Text className="text-xl text-indigo-500 font-medium">
          Tüm kullanıcılarla sohbet ediyorsunuz
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-zinc-100">
      <StatusBar barStyle="light-content" />
      <UserList users={filteredUsers} onPress={handleCreatingChat} />
    </View>
  );
};

export default AddUsers;
