import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

import { View, Text } from "react-native";
import React from "react";

const MenuItem = ({ text, action, value, icon, color }) => {
  return (
    <MenuOption onSelect={() => action(value)}>
      <View className="flex-row items-center py-1 px-4 justify-between ">
        <Text style={{ color: color }}>{text}</Text>
        <View>{icon}</View>
      </View>
    </MenuOption>
  );
};

export default MenuItem;
