import PlusButtonComponent from "@/components/PlusButtonComponent";
import { fetchUserData } from "@/redux/slices/userSlice";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const Chats = () => {
  const { userData, isLoading, errorMessage } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  return (
    <View className="flex-1 bg-zinc-100">
      <PlusButtonComponent />
    </View>
  );
};

export default Chats;
