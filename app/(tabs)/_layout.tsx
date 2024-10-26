import HeaderComponents from "@/components/Headers/HeaderComponents";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#3F51B5",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#f2f2f2",
          paddingBottom: 10,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "SOHBET",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? "chatbubbles-sharp" : "chatbubbles-outline"}
              color={color}
            />
          ),
          header: () => <HeaderComponents title="SOHBET" />,
        }}
      />

      <Tabs.Screen
        name="groups"
        options={{
          title: "GRUPLAR",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? "people-sharp" : "people-outline"}
              color={color}
            />
          ),
          header: () => <HeaderComponents title="GRUPLAR" />,
        }}
      />
    </Tabs>
  );
}
