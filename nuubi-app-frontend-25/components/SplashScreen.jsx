import React from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { globalStyles } from "../styles/global";

export default function SplashScreen({ navigation }) {
  const [myMessage, setMyMessage] = React.useState(null);
  const [myMessage2, setMyMessage2] = React.useState(null);

  const getMessage = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/backend/getmessage2`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      const jsonData = await response.json();
      setMyMessage(jsonData.message);
      console.log(jsonData.message);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getMessage2 = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/auth/getmessage`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      const jsonData = await response.json();
      setMyMessage2(jsonData.message);
      console.log(jsonData.message);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getMessage();
    getMessage2();
  }, []);

  return (
    <SafeAreaView style={globalStyles.container}>
      <Text>hi</Text>
      <Text>{myMessage}</Text>
      <Text>hi, auth message is {myMessage2}</Text>

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
        <Text style={globalStyles.secondaryButtonText}>Learn more</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
