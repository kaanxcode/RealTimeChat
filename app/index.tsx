import LoadingComponent from "@/components/LoadingComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StartPage = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        SplashScreen.preventAutoHideAsync();
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          setTimeout(() => {
            SplashScreen.hideAsync();
            setIsReady(true);
          }, 1000);
        }
      } catch (error) {
        console.log("Token kontrol hatası:", error);
      }
    };

    checkToken();
  }, [router]);

  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center bg-zinc-100">
        <LoadingComponent size={60} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ImageBackground
        source={require("../assets/images/start-page-bg.jpeg")}
        className="w-full h-full"
        imageStyle={{ resizeMode: "cover", opacity: 0.4 }}
      >
        <View className="flex-1 ">
          <Image
            source={require("../assets/images/telefon.webp")}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        <View className="flex-1 justify-center items-center bg-white rounded-tl-[48] rounded-tr-[48] gap-10">
          <View className="gap-6 justify-center items-center ">
            <Text className="text-5xl font-bold text-zinc-900 ">
              Hemen Başla
            </Text>
            <Text className="text-xl text-zinc-500">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatibus, maiores.
            </Text>
          </View>
          <View className="gap-3 w-full px-4">
            <TouchableOpacity
              className="bg-indigo-500 py-3 rounded-lg"
              onPress={() => router.push("/login")}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Giriş Yap
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border border-indigo-500 py-3 rounded-lg"
              onPress={() => router.push("/register")}
            >
              <Text className="text-indigo-500 text-center text-lg font-semibold">
                Kayıt Ol
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default StartPage;
