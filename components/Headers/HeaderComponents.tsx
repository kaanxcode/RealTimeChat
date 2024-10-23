import { logout } from "@/redux/slices/authSlice";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Text, View } from "react-native";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { blurhash } from "../../utils/common";
import MenuItem from "../CustomMenuItem";

const HeaderComponents = ({ title }) => {
  const ios = Platform.OS === "ios";
  const { top } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const router = useRouter();
  const { userData } = useSelector((state) => state.user);

  const handleProfile = () => {
    router.push("/stack/profile");
  };

  const handleLogout = () => {
    try {
      dispatch(logout()).unwrap();
      router.replace("/login");
    } catch (error) {
      console.log("Header componenet in logout function", error);
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Çıkış yapılırken bir hata oluştu.",
      });
    }
  };

  return (
    <View
      className="flex-row justify-between items-center px-5 py-2 bg-indigo-500 rounded-b-2xl"
      style={{ paddingTop: ios ? top : top + 10 }}
    >
      <View>
        <Text className="text-2xl font-bold tracking-wider text-white">
          {title}
        </Text>
      </View>
      <View>
        <Menu>
          <MenuTrigger
            customStyles={{
              triggerWrapper: {},
            }}
          >
            <Image
              style={{ width: 50, height: 50, borderRadius: 25 }}
              source={{ uri: userData?.profileImg }}
              placeholder={blurhash}
              contentFit="cover"
              transition={500}
            />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                backgroundColor: "white",
                borderRadius: 10,
                borderCurve: "continuous",
                marginTop: 40,
                marginLeft: -50,
                width: 140,
                padding: 5,
                shadowOpacity: 0.5,
                shadowRadius: 10,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 0 },
              },
            }}
          >
            <MenuItem
              text="Profilim"
              action={handleProfile}
              value={null}
              icon={<Feather name="user" size={24} color="black" />}
              color={"black"}
            />
            <MenuItem
              text="Çıkış Yap"
              action={handleLogout}
              value={null}
              icon={<Feather name="log-out" size={24} color="red" />}
              color={"red"}
            />
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
};

export default HeaderComponents;
