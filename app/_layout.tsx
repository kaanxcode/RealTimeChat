import AuthHeader from "@/components/Headers/AuthHeader";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";
import Toast from "react-native-toast-message";
import { Provider, useDispatch, useSelector } from "react-redux";
import "../global.css";
import { autoLogin } from "../redux/slices/authSlice";
import store from "../redux/store";

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

  return null;
}

export default function RootLayout() {
  return (
    <MenuProvider>
      <Provider store={store}>
        <Stack screenOptions={{ animation: "fade" }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="login"
            options={{ header: () => <AuthHeader title="GİRİŞ YAP" /> }}
          />
          <Stack.Screen
            name="register"
            options={{ header: () => <AuthHeader title="KAYIT OL" /> }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="stack" options={{ headerShown: false }} />
          <Stack.Screen name="modals" options={{ headerShown: false }} />
        </Stack>
        <MainLayout />
        <Toast />
      </Provider>
    </MenuProvider>
  );
}
