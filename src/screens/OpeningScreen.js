import { Image, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OpeningScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Onboarding");
    }, 2000);
  });
  return (
    <SafeAreaView className="bg-[#53B175] flex-1 justify-center w-full h-full">
      <View className="flex-row items-center justify-center mb-24">
        <Image source={require("../assets/Splash/logo.png")} />
      </View>
      <View className="flex-row items-center justify-center">
        <Image source={require("../assets/Splash/BeCommerce.png")} />
      </View>
    </SafeAreaView>
  );
}
