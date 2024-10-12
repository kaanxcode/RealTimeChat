import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import LoadingComponent from "@/components/LoadingComponent";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { login } from "@/redux/slices/authSlice";
import Toast from "react-native-toast-message";
import { validateLogin } from "@/utils/validationForm";
import { getErrorMessage } from "@/utils/firebaseError";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const { email, password } = form;
      const errors = validateLogin(form);
      if (errors) {
        Toast.show({
          type: "error",
          text1: "Hata",
          text2: errors,
        });
        return;
      }

      await dispatch(login({ email, password })).unwrap();

      router.replace("/(tabs)/");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: getErrorMessage(error),
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-indigo-500">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-indigo-500 justify-center px-4">
        <Text className="text-3xl font-bold text-white tracking-wider">
          Giriş Yap
        </Text>
      </View>

      <View className="flex-[4] bg-white p-6 rounded-tl-[18] rounded-tr-[18] gap-4">
        <Text className="text-3xl text-zinc-900 self-center font-bold tracking-wider">
          HOŞGELDİN!
        </Text>
        <Text className="text-zinc-500 text-center">
          Seni gördüğümüze çok sevindik. Bilgilerini girip giriş yapabilirsin.
        </Text>

        <View className="h-16 flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
          <AntDesign name="mail" size={24} color="gray" />
          <TextInput
            placeholder="E-Posta"
            keyboardType="email-address"
            className="flex-1 text-md font-semibold text-naturel-700"
            placeholderTextColor={"gray"}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
        </View>

        <View className="h-16 flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
          <AntDesign name="lock1" size={24} color="gray" />
          <TextInput
            placeholder="Şifre"
            className="flex-1 text-md font-semibold text-naturel-700"
            placeholderTextColor={"gray"}
            secureTextEntry
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
        </View>

        <TouchableOpacity onPress={() => router.push("/modals/forgot-pass")}>
          <Text className="text-zinc-500 font-bold self-end py-2">
            Şifremi unuttum!
          </Text>
        </TouchableOpacity>

        {isLoading ? (
          <View className="justify-center items-center">
            <LoadingComponent size={78} />
          </View>
        ) : (
          <View className="mb-4">
            <TouchableOpacity
              className="bg-indigo-500 py-3 rounded-lg"
              onPress={handleLogin}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Giriş Yap
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="items-center gap-4">
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text className="text-zinc-500">
              Hesabın yok mu? &nbsp;
              <Text className="text-indigo-500 underline">Kayıt ol</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
