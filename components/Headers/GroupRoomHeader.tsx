import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import React from "react";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const GroupRoomHeader = ({ router }) => {
  const { top } = useSafeAreaInsets();
  const ios = Platform.OS === "ios";
  const { activeGroupChatImage, activeGroupChatName } = useSelector(
    (state) => state.groupChat
  );

  return (
    <Stack.Screen
      options={{
        title: "",
        headerShadowVisible: false,
        header: () => (
          <View
            style={{
              paddingTop: ios ? top : top + 5,
            }}
            className="bg-indigo-500 flex-row justify-between items-center px-5 py-4 rounded-b-2xl"
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back-outline" size={24} color="white" />
              </TouchableOpacity>

              <Image
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  marginLeft: 8,
                }}
                source={{ uri: activeGroupChatImage }}
              />

              <View style={{ marginLeft: 8 }}>
                <Text
                  style={{ fontSize: 18, fontWeight: "600", color: "white" }}
                >
                  {activeGroupChatName}
                </Text>
              </View>
            </View>

            {/* Sağ Kısım (headerRight) */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => router.push("/modals/group-info")}
              >
                <Feather name="info" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ),
      }}
    />
  );
};

export default GroupRoomHeader;
