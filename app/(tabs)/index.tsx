import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "@/redux/slices/userSlice";

const Chats = () => {
  const { userData, isLoading, errorMessage } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  return (
    <View>
      <Text>Chats Page</Text>
      {isLoading && <Text>Yükleniyor...</Text>}
      {errorMessage && <Text>{errorMessage}</Text>}
      {userData && <Text>Kullanıcı: {userData.username}</Text>}
    </View>
  );
};

export default Chats;
