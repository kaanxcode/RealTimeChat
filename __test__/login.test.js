import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import Login from "../app/login";

describe("Login Component", () => {
  it("updates email input correctly", () => {
    const { getByPlaceholderText } = render(<Login />);

    const emailInput = getByPlaceholderText("E-Posta");

    fireEvent.changeText(emailInput, "test@example.com");

    expect(emailInput.props.value).toBe("test@example.com");
  });

  it("updates password input correctly", () => {
    const { getByPlaceholderText } = render(<Login />);

    const passwordInput = getByPlaceholderText("Şifre");

    fireEvent.changeText(passwordInput, "password123");

    expect(passwordInput.props.value).toBe("password123");
  });
});
