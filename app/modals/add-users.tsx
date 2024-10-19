import UserList from "@/components/List/search/UserList";
import LoadingComponent from "@/components/LoadingComponent";
import { addChats, fetchUsers } from "@/redux/slices/addUsersSlice";
import React, { useEffect } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const AddUsers = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.addUsers);

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
      <SafeAreaView className="flex-1 pt-20 bg-zinc-100">
        <Text className="text-3xl font-bold">No users found</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-zinc-100">
      <UserList users={users} onPress={handleCreatingChat} />
    </View>
  );
};

export default AddUsers;
