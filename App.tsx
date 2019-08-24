import React, { useEffect, useState } from "react";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import DefaultScreen from "./screens/DefaultScreen";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
        "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
        ...Ionicons.font
      });

      setIsReady(true);
    };

    loadFonts();
  }, [0]);

  if (!isReady) {
    return <AppLoading />;
  }

  return <DefaultScreen />;
}
