import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import { Stack, Tabs } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ animation: "fade" }}>
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}
