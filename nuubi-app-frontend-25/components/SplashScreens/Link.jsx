import React from "react";
import { TouchableOpacity, Linking } from "react-native";

export default function ({ url, children }) {
  const handlePress = async () => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open this URL: ${url}`);
    }
  };

  return <TouchableOpacity onPress={handlePress}>{children}</TouchableOpacity>;
}
