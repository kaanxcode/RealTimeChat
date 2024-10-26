import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

const useOrientation = () => {
  const [isPortrait, setIsPortrait] = useState(true);

  const updateLayout = () => {
    const { height, width } = Dimensions.get("window");
    setIsPortrait(height > width);
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", updateLayout);

    updateLayout();

    return () => {
      subscription?.remove();
    };
  }, []);

  return isPortrait;
};

export default useOrientation;
