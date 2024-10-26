import LoadingComponent from "@/components/LoadingComponent";
import { register } from "@/redux/slices/authSlice";
import { getErrorMessage } from "@/utils/firebaseError";
import { validateRegistration } from "@/utils/validationForm.js";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
    try {
      const { username, email, password } = form;
      const errors = validateRegistration(form);

      if (errors) {
        Toast.show({
          type: "error",
          text1: "Hata",
          text2: errors,
        });
        return;
      }

      const profileImg = `https://avatar.iran.liara.run/username?username=${username}`;

      await dispatch(
        register({ username, email, password, profileImg })
      ).unwrap();

      Toast.show({
        type: "success",
        text1: "Kayıt Başarılı",
        text2: "Giriş yapabilirsiniz.",
      });

      router.push("/login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: getErrorMessage(error),
      });
    }
  };

  return (
    <SafeAreaView className="flex-1  bg-indigo-500 ">
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-[4] bg-white p-6 rounded-tl-[18] rounded-tr-[18] gap-4">
          <Text className="text-3xl text-zinc-900 self-center font-bold tracking-wider ">
            BİZE KATIL!
          </Text>
          <Text className="text-zinc-500 text-center">
            Harika aramıza yeni biri katılacağı için çok heyecanlıyız.
            Bilgilerini girerek kayıt ol bize katıl.
          </Text>

          <View className="h-16 flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
            <AntDesign name="user" size={24} color="gray" />
            <TextInput
              placeholder="Ad Soyad"
              className="flex-1 text-md font-semibold text-naturel-700"
              placeholderTextColor={"gray"}
              value={form.username}
              onChangeText={(value) => setForm({ ...form, username: value })}
            />
          </View>

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

          <View className="h-16 flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
            <AntDesign name="lock1" size={24} color="gray" />
            <TextInput
              placeholder="Şifre Tekrar"
              className="flex-1 text-md font-semibold text-naturel-700"
              placeholderTextColor={"gray"}
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={(value) =>
                setForm({ ...form, confirmPassword: value })
              }
            />
          </View>

          {isLoading ? (
            <View className=" justify-center items-center">
              <LoadingComponent size={78} />
            </View>
          ) : (
            <View className="mb-4">
              <TouchableOpacity
                className="bg-indigo-500 py-3 rounded-lg"
                onPress={handleRegister}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  Kayıt Ol
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="items-center gap-4">
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text className="text-zinc-500">
                Zaten hesabın var mı? &nbsp;
                <Text className="text-indigo-500 underline">Giriş yap</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
