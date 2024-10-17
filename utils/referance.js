import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    return userId;
  } catch (error) {
    console.log("Error getting userId:", error);
    return null;
  }
};
