import StackHeaderComponent from "@/components/StackHeaderComponent";
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

  if (isLoading) {
    return null;
  }
  return null;
}

export default function RootLayout() {
  return (
    <MenuProvider>
      <Provider store={store}>
        <Stack screenOptions={{ animation: "fade" }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="stack" options={{ headerShown: false }} />
          <Stack.Screen
            name="modals/forgot-pass"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="modals/image-pick-and-upload"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="modals/add-users"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              header: () => <StackHeaderComponent title="Kullanıcılar" />,
            }}
          />
          <Stack.Screen
            name="modals/create-group"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              header: () => <StackHeaderComponent title="Grup Oluştur" />,
            }}
          />
          <Stack.Screen
            name="modals/group-info"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              header: () => <StackHeaderComponent title="Grup Bilgileri" />,
            }}
          />
          <Stack.Screen
            name="modals/picker"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              header: () => <StackHeaderComponent title="Dosya ekle" />,
            }}
          />
        </Stack>
        <MainLayout />
        <Toast />
      </Provider>
    </MenuProvider>
  );
}
