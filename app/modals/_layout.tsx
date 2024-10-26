import StackHeaderComponent from "@/components/Headers/StackHeaderComponent";
import { Stack } from "expo-router";

export default function MoadlLayout() {
  return (
    <Stack screenOptions={{ animation: "fade" }}>
      <Stack.Screen
        name="forgot-pass"
        options={{ headerShown: false, presentation: "modal" }}
      />

      <Stack.Screen
        name="add-users"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          header: () => <StackHeaderComponent title="Kullanıcılar" />,
        }}
      />
      <Stack.Screen
        name="create-group"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          header: () => <StackHeaderComponent title="Grup Oluştur" />,
        }}
      />
      <Stack.Screen
        name="group-info"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          header: () => <StackHeaderComponent title="Grup Bilgileri" />,
        }}
      />
    </Stack>
  );
}
