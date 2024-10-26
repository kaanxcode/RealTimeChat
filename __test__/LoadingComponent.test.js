import { render } from "@testing-library/react-native";
import LottieView from "lottie-react-native";
import React from "react";
import LoadingComponent from "../components/LoadingComponent";

jest.mock("lottie-react-native", () => {
  return jest.fn(() => <></>);
});

describe("LoadingComponent", () => {
  it("renders correctly with the given size", () => {
    const size = 100;
    const { getByTestId } = render(<LoadingComponent size={size} />);

    const view = getByTestId("loading-view");
    expect(view.props.style).toEqual(
      expect.objectContaining({ height: size, aspectRatio: 1 })
    );

    expect(LottieView).toHaveBeenCalledTimes(1);
    expect(LottieView).toHaveBeenCalledWith(
      expect.objectContaining({
        source: require("../assets/images/loading.json"),
        autoPlay: true,
        loop: true,
      }),
      {}
    );
  });
});
