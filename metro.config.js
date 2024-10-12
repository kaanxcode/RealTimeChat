const { getDefaultConfig } = require("@expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const defaultConfig = getDefaultConfig(__dirname);

// '.cjs' uzantısını çözümleyebilmek için sourceExts'e ekliyoruz
defaultConfig.resolver.sourceExts.push("cjs");

// NativeWind desteğini de ekliyoruz
module.exports = withNativeWind(defaultConfig, { input: "./global.css" });
