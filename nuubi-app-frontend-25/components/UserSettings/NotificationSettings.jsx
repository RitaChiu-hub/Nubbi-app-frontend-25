import React, { useEffect, useState, useContext } from "react";
import { ErrorMessage, Formik } from "formik";
import {
  ScrollView,
  View,
  Text,
  Switch,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import { useFocusEffect } from "@react-navigation/native";

export default function NotificationSettings({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [isEnabled, setIsEnabled] = useState(true); // Default ON
  const [statusText, setStatusText] = useState("");
  const { goBack, navigate } = navigation;
  const [status, setStatus] = React.useState(null);
  const [statusColor, setStatusColor] = React.useState(
    globalStyles.captionError
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Notification Settings</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  // (Android) create channel once
  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      }).catch(() => {});
    }
  }, []);

  // Load stored preference (you can later swap to a backend GET)
  useEffect(() => {
    SecureStore.getItemAsync("pushEnabled").then((val) => {
      if (val !== null) setInitialEnabled(val === "true");
    });
  }, []);

  const [layoutHeight, setLayoutHeight] = React.useState(0);

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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust if your header takes space
    >
      <ScrollView
        style={{
          backgroundColor: "#fbfbfb",
        }}
        onLayout={(event) => {
          if (!layoutHeight) {
            setLayoutHeight(event.nativeEvent.layout.height);
          }
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 40,
          }}
        >
          <View style={globalStyles.widthContainer}>
            <Formik
              enableReinitialize
              initialValues={{ enabled: isEnabled }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await SecureStore.setItemAsync(
                    "pushEnabled",
                    String(values.enabled)
                  );

                  if (values.enabled) {
                    const t = await registerForPushNotificationsAsync();
                    if (!t) {
                      setStatusText(
                        "Permission denied. Notifications remain off."
                      );
                      return;
                    }
                  }

                  const auth = await SecureStore.getItemAsync("token");
                  await fetch(
                    "https://coral-app-n96bn.ondigitalocean.app/settings/notif-prefs",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
                      },
                      body: JSON.stringify({ enabled: values.enabled }),
                    }
                  );

                  setStatusText(
                    values.enabled
                      ? "Push notifications enabled."
                      : "Push notifications disabled."
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
                <>
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
                        color: "#333333",
                        fontFamily: "Poppins_500Medium",
                      }}
                    >
                      Enable Push Notifications
                    </Text>
                    <Switch
                      trackColor={{ false: "#767577", true: "#2482aa" }}
                      thumbColor="#fff"
                      onValueChange={(v) => setFieldValue("enabled", v)}
                      value={values.enabled}
                    />
                  </View>

                  {!!statusText && (
                    <Text
                      style={[
                        globalStyles.captionErrorSuccess,
                        { marginBottom: 16 },
                      ]}
                    >
                      {statusText}
                    </Text>
                  )}
                  <View style={{ padding: 20 }}></View>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    style={[
                      globalStyles.primaryButton,
                      { borderRadius: 60, opacity: isSubmitting ? 0.6 : 1 },
                    ]}
                  >
                    <Text style={globalStyles.primaryButtonText}>
                      {isSubmitting ? "Saving..." : "Save"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[globalStyles.secondaryButton, { marginTop: 10 }]}
                    accessibilityRole="button"
                    onPress={() => navigation.goBack()}
                  >
                    <Text
                      style={[
                        globalStyles.primaryButtonText,
                        { color: "#050505" },
                      ]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
