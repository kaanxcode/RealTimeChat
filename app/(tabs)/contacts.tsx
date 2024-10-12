import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { logout } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router"; // Yönlendirme için import edin

const Contacts = () => {
  const dispatch = useDispatch();
  const router = useRouter(); // Router'ı kullanın

  const handleLogout = async () => {
    const resultAction = await dispatch(logout());
    if (logout.fulfilled.match(resultAction)) {
      console.log("Logout successful");
      // Logout başarılı olduğunda giriş sayfasına yönlendirin
      router.replace("/login");
    } else {
      console.log("Logout failed:", resultAction.payload);
      // Çıkış işlemi başarısızsa hata mesajını göster
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <Text>Contacts</Text>
    </View>
  );
};

export default Contacts;
