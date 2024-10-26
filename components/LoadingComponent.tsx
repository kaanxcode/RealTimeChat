import LottieView from "lottie-react-native";
import React from "react";
import { View } from "react-native";

const LoadingComponent = ({ size }) => {
  return (
    <View style={{ height: size, aspectRatio: 1 }} testID="loading-view">
      <LottieView
        source={require("../assets/images/loading.json")}
        autoPlay
        loop
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default LoadingComponent;
