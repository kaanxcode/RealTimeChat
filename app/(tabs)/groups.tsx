import LoadingComponent from "@/components/LoadingComponent";
import PlusButtonComponent from "@/components/PlusButtonComponent";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const Groups = () => {
  const dispatch = useDispatch();
  // buradan kaldırlacak alttaki kod
  const { chats, isLoading } = useSelector((state) => state.chat);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-zinc-100">
        <LoadingComponent size={60} />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-zinc-100">
      <PlusButtonComponent route="create-group" />
    </View>
  );
};

export default Groups;
