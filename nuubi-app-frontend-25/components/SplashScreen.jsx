import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import { globalStyles } from "../styles/global";
import * as SplashScreenExpo from "expo-splash-screen";

SplashScreenExpo.preventAutoHideAsync();

export default function SplashScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreenExpo.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={globalStyles.container} onLayout={onLayoutRootView}>
      <Image
        style={{ width: 200, height: 200 }}
        source={require("../assets/nuubiTransparent.png")}
        alt="The Nuubi logo, a green and blue chat bubble with an open book at the center."
      />
      <View style={{ marginVertical: 20 }}></View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
          padding: 20,
          marginLeft: 25,
          marginRight: 25,
        }}
      >
        <Text>Welcome to Nuubi,</Text>
        <Text style={{ fontWeight: "normal" }}>
          {" "}
          the chat platform for learning.
        </Text>
      </Text>
      <View style={globalStyles.buttonContainer}>
        <View>
          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={globalStyles.secondaryButtonText}>LOG IN</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={globalStyles.primaryButtonText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginVertical: 5 }}></View>
      <TouchableOpacity
        style={globalStyles.secondaryButton}
        onPress={() => navigation.navigate("LearnMore1")}
      >
        <Text style={globalStyles.secondaryButtonText}>LEARN MORE</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={globalStyles.secondaryButton}
        onPress={() => navigation.navigate("PrivacyScreen")}
      >
        <Text style={globalStyles.secondaryButtonText}>PRIVACY POLICY</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
