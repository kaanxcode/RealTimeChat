import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";
import HeaderComponents from "@/components/HeaderComponents";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Chats",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
          header: () => <HeaderComponents title="Sohbet" />,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: "Kişiler",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={28} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
