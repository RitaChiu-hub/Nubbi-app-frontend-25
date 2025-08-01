import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Switch,
  Platform,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";

export default function NotificationSettings({ navigation }) {
  const { user } = useContext(AccountContext);
  const [isEnabled, setIsEnabled] = useState(true); // Default ON
  const [statusText, setStatusText] = useState("");

  async function registerForPushNotificationsAsync(user) {
    if (Platform.OS !== "web") {
      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          alert("Notification permission not granted.");
          return null;
        }

        const expoPushToken = (await Notifications.getExpoPushTokenAsync())
          .data;
        const token = await SecureStore.getItemAsync("token");

        await fetch(
          "https://coral-app-n96bn.ondigitalocean.app/settings/savepushtoken",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ ...user, pushToken: expoPushToken }),
          }
        );

        return expoPushToken;
      } catch (err) {
        return null;
      }
    }
  }

  useEffect(() => {
    // Load stored preference
    SecureStore.getItemAsync("pushEnabled").then((val) => {
      if (val !== null) setIsEnabled(val === "true");
    });
  }, []);

  const toggleSwitch = async () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    await SecureStore.setItemAsync("pushEnabled", newValue.toString());

    if (newValue) {
      const token = await registerForPushNotificationsAsync(user);
      if (token) setStatusText("Push notifications enabled.");
    } else {
      // Optionally: remove token on backend
      setStatusText("Push notifications disabled.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView style={{ backgroundColor: "#fbfbfb" }}>
        <View style={globalStyles.widthContainer}>
          <Text
            style={[
              globalStyles.h2HeadingMedium,
              { fontSize: 22, marginVertical: 20, color: "#606060" },
            ]}
          >
            Push Notification Settings
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#606060",
                fontFamily: "Poppins_500Medium",
              }}
            >
              Enable Push Notifications
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#2482aa" }}
              thumbColor={isEnabled ? "#fff" : "#fff"}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>

          {statusText !== "" && (
            <Text style={[globalStyles.captionErrorSuccess, { marginTop: 10 }]}>
              {statusText}
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
