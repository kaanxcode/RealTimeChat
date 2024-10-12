import { Stack, useRouter } from "expo-router";
import "../global.css";
import store from "../redux/store";
import { Provider } from "react-redux";
import Toast from "react-native-toast-message";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { autoLogin } from "../redux/slices/authSlice";

function MainLayout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleLogin = async () => {
      await dispatch(autoLogin());
      if (isAuthenticated) {
        router.replace("/(tabs)");
      }
    };
    handleLogin();
  }, [dispatch, isAuthenticated]);

  if (isLoading) {
    return null;
  }
  return null;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ animation: "fade" }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modals/forgot-pass"
          options={{ headerShown: false, presentation: "modal" }}
        />
      </Stack>
      <MainLayout />
      <Toast />
    </Provider>
  );
}
