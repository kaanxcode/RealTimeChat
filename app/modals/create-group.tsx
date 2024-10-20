import GroupUserList from "@/components/List/Group/GroupSearch/GroupUserList";
import LoadingComponent from "@/components/LoadingComponent";
import { fetchUsers } from "@/redux/slices/addUsersSlice";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const AddUsers = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.addUsers);

  // Seçilen kullanıcıları takip eden state
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    try {
      dispatch(fetchUsers()).unwrap();
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  }, [dispatch]);

  const handleUserSelect = (user) => {
    // Seçilen kullanıcıyı listeye ekleme veya çıkarma
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreatingGroupChat = async () => {
    if (selectedUsers.length >= 2) {
      try {
        console.log("Group created with users:", selectedUsers);
        // Grup oluşturma işlemi burada olacak
      } catch (error) {
        console.log("Error creating group chat:", error);
      }
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
      <GroupUserList
        users={users}
        selectedUsers={selectedUsers}
        onPress={handleUserSelect}
      />
      {selectedUsers.length >= 2 && (
        <TouchableOpacity
          onPress={handleCreatingGroupChat}
          className="bg-indigo-500 py-4 px-6 rounded-full m-4"
        >
          <Text className="text-white text-center text-lg">Grup Oluştur</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AddUsers;
