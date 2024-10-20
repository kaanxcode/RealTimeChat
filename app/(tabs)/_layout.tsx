import HeaderComponents from "@/components/HeaderComponents";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#3F51B5" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? "chatbubbles-sharp" : "chatbubbles-outline"}
              color={color}
            />
          ),
          header: () => <HeaderComponents title="Sohbet" />,
        }}
      />

      <Tabs.Screen
        name="groups"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? "people-sharp" : "people-outline"}
              color={color}
            />
          ),
          header: () => <HeaderComponents title="Gruplarım" />,
        }}
      />
    </Tabs>
  );
}
