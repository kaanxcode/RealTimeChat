import GroupChatList from "@/components/List/Group/GroupChat/GroupChatList";
import LoadingComponent from "@/components/LoadingComponent";
import PlusButtonComponent from "@/components/PlusButtonComponent";
import useFetchGroupChats from "@/hooks/useFetchGroupChats";
import {
  setActiveGroupChat,
  setGroupChats,
} from "@/redux/slices/groupChatSlice";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const Groups = () => {
  const dispatch = useDispatch();
  const { groupChats, isLoading } = useSelector((state) => state.groupChat);
  const { userData } = useSelector((state) => state.user);

  useFetchGroupChats(userData?.id, (sortedChats) => {
    dispatch(setGroupChats(sortedChats));
  });

  const handleSelectGroupChat = (groupChat) => {
    try {
      dispatch(
        setActiveGroupChat({
          chatId: groupChat.chatId,
          groupImage: groupChat.groupImage,
          groupName: groupChat.groupName,
          participants: groupChat.participants,
        })
      ).unwrap();
    } catch (error) {
      console.log("groups.tsx in setActiveGroupChat", error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-zinc-100">
        <LoadingComponent size={60} />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-zinc-100">
      <GroupChatList
        groupChats={groupChats}
        onSelectGroupChat={handleSelectGroupChat}
      />
      <PlusButtonComponent route="create-group" />
    </View>
  );
};

export default Groups;