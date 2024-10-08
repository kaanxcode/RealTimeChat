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

const Register = () => {
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView className="flex-1  bg-indigo-500 ">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-indigo-500 justify-center  px-4">
        <Text className="text-3xl font-bold text-white tracking-wider">
          Kayıt Ol
        </Text>
      </View>

      <View className="flex-[4] bg-white p-6 rounded-tl-[18] rounded-tr-[18] gap-4">
        <Text className="text-3xl text-zinc-900 self-center font-bold tracking-wider ">
          BİZE KATIL!
        </Text>
        <Text className="text-zinc-500 text-center">
          Harika aramıza yeni biri katılacağı için çok heyecanlıyız. Bilgilerini
          girerek kayıt ol bize katıl.
        </Text>
        <View className="h-16 flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
          <AntDesign name="user" size={24} color="gray" />
          <TextInput
            placeholder="Ad Soyad"
            className="flex-1 text-md font-semibold text-naturel-700"
            placeholderTextColor={"gray"}
          />
        </View>
        <View className="h-16 flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
          <AntDesign name="mail" size={24} color="gray" />
          <TextInput
            placeholder="E-Posta"
            className="flex-1 text-md font-semibold text-naturel-700"
            placeholderTextColor={"gray"}
          />
        </View>
        <View className="h-16 flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
          <AntDesign name="lock1" size={24} color="gray" />
          <TextInput
            placeholder="Şifre"
            className="flex-1 text-md font-semibold text-naturel-700"
            placeholderTextColor={"gray"}
            secureTextEntry
          />
        </View>
        <View className="h-16 flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
          <AntDesign name="lock1" size={24} color="gray" />
          <TextInput
            placeholder="Şifre Tekrar"
            className="flex-1 text-md font-semibold text-naturel-700"
            placeholderTextColor={"gray"}
            secureTextEntry
          />
        </View>

        {loading ? (
          <View className=" justify-center items-center">
            <LoadingComponent size={78} />
          </View>
        ) : (
          <View className="mb-4">
            <TouchableOpacity className="bg-indigo-500 py-3 rounded-lg">
              <Text className="text-white text-center text-lg font-semibold">
                Kayıt Ol
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="items-center gap-4">
          <TouchableOpacity>
            <Text className="text-zinc-500">
              Zaten hesabın var mı? &nbsp;
              <Text className="text-indigo-500 underline">Giriş yap</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;
