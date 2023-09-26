import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../styles/global";

export default function SplashScreen({ navigation }) {
  return (
    <SafeAreaView style={globalStyles.container}>
      <Image
        style={{ width: 200, height: 200 }}
        source={require("../assets/nuubiTransparent.png")}
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
            <Text style={globalStyles.secondaryButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={globalStyles.primaryButtonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginVertical: 5 }}></View>
      <TouchableOpacity
        style={globalStyles.secondaryButton}
        onPress={() => navigation.navigate("LearnMore1")}
      >
        <Text style={globalStyles.secondaryButtonText}>Learn More</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={globalStyles.secondaryButton}
        onPress={() => navigation.navigate("PrivacyScreen")}
      >
        <Text style={globalStyles.secondaryButtonText}>Privacy Policy</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
