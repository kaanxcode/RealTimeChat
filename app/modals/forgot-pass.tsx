import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { resetPassword } from "@/redux/slices/authSlice"; // resetPassword fonksiyonunun yolu
import { useRouter } from "expo-router";
import { getErrorMessage } from "@/utils/firebaseError";
import AntDesign from "@expo/vector-icons/AntDesign";

const ForgotPasswordModal = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleResetPassword = async () => {
    try {
      await dispatch(resetPassword(email)).unwrap();
      Toast.show({
        type: "success",
        text1: "Şifreniz sıfırlandı!",
        text2: "E-postanızı kontrol edin.",
      });
      router.back(); // Modalı kapat
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Hata!",
        text2: getErrorMessage(error), // Hata mesajını göster
      });
    }
  };

  return (
    <View className="inset-0 flex-1 justify-center items-center bg-opacity-40">
      <View className="bg-white p-5 rounded-lg shadow-lg w-11/12 max-w-md gap-5">
        <Text className="text-xl font-semibold  text-center">
          Şifre Sıfırlama
        </Text>

        <View className="h-16 flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl ">
          <AntDesign name="mail" size={24} color="gray" />
          <TextInput
            placeholder="E-Posta"
            keyboardType="email-address"
            className="flex-1 text-md font-semibold text-naturel-700"
            placeholderTextColor={"gray"}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="bg-indigo-500 rounded-md py-2 px-4 flex-1 mr-2"
            onPress={handleResetPassword}
          >
            <Text className="text-white text-center">Gönder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 rounded-md py-2 px-4 flex-1 ml-2"
            onPress={() => router.back()}
          >
            <Text className="text-white text-center">İptal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgotPasswordModal;
