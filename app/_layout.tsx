import { Stack } from "expo-router";

import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(stack)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(stack)/register" options={{ headerShown: false }} />
    </Stack>
  );
}
