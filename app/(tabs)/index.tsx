import ChatList from "@/components/List/Chat/ChatList";
import LoadingComponent from "@/components/LoadingComponent";
import PlusButtonComponent from "@/components/PlusButtonComponent";
import useFetchChats from "@/hooks/useFetchChats";

import { setActiveChat, setChats } from "@/redux/slices/chatSlice";
import { fetchUserData } from "@/redux/slices/userSlice";
import { useEffect } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const Chats = () => {
  const dispatch = useDispatch();
  const { userData, isLoading: userLoading } = useSelector(
    (state) => state.user
  );
  const { chats, isLoading: chatsLoading } = useSelector((state) => state.chat);

  useEffect(() => {
    try {
      dispatch(fetchUserData()).unwrap();
    } catch (error) {
      console.log("İndex.tsx in fetchuserdata", error);
    }
  }, [dispatch]);

  useFetchChats(userData?.id, (sortedChats) => {
    dispatch(setChats(sortedChats));
  });

  const handleSelectChat = (chat) => {
    try {
      dispatch(setActiveChat({ chatId: chat.id, user: chat.user })).unwrap();
    } catch (error) {
      console.log("index.tsx in setactivechat", error);
    }
  };

  if (userLoading || chatsLoading) {
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
