import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ animation: "fade" }}>
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="chat-room" />
      <Stack.Screen name="group-room" />
    </Stack>
  );
}
