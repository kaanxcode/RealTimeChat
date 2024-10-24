import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import MenuItem from "../components/CustomMenuItem";

describe("MenuItem", () => {
  const mockAction = jest.fn();
  const text = "Menu Item";
  const value = "itemValue";
  const icon = <Text>🔔</Text>;
  const color = "blue";

  it("renders correctly", () => {
    const { getByText } = render(
      <MenuProvider>
        <MenuItem
          text={text}
          action={mockAction}
          value={value}
          icon={icon}
          color={color}
        />
      </MenuProvider>
    );

    expect(getByText(text)).toBeTruthy();

    expect(getByText("🔔")).toBeTruthy();

    const menuText = getByText(text);
    expect(menuText.props.style).toEqual({ color: "blue" });
  });

  it("calls action when selected", () => {
    const { getByText } = render(
      <MenuProvider>
        <MenuItem
          text={text}
          action={mockAction}
          value={value}
          icon={icon}
          color={color}
        />
      </MenuProvider>
    );

    fireEvent.press(getByText(text));

    expect(mockAction).toHaveBeenCalledTimes(1);

    expect(mockAction).toHaveBeenCalledWith(value);
  });
});
