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
  Linking,
  AppState,
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
  const [denied, setDenied] = React.useState(false);

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

  async function getBackendEnabled() {
    const auth = await SecureStore.getItemAsync("token");
    const res = await fetch(
      "https://coral-app-n96bn.ondigitalocean.app/settings/get-notif-prefs",
      {
        method: "POST", // your backend is POST for JWT body
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: auth }),
      }
    );
    const json = await res.json();
    return !!json.enabled;
  }

  // helper to save backend pref
  async function setBackendEnabled(enabled) {
    const auth = await SecureStore.getItemAsync("token");
    await fetch(
      "https://coral-app-n96bn.ondigitalocean.app/settings/notif-prefs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: auth, enabled }),
      }
    );
  }
  // reconcile effect
  useEffect(() => {
    let mounted = true;
    const reconcile = async () => {
      const perm = await Notifications.getPermissionsAsync();
      const deviceGranted = perm.status === "granted";
      const backendEnabled = await getBackendEnabled();
      // Case A: Device denied but backend says enabled -> flip OFF
      if (!deviceGranted && backendEnabled) {
        if (!mounted) return;
        setIsEnabled(false);
        await setBackendEnabled(false);
        setStatusText(
          "Notifications are disabled at the device level. We turned them off in Nuubi to match."
        );
      }

      // Case B: Device granted but backend disabled -> auto-enable
      if (deviceGranted && !backendEnabled) {
        await setBackendEnabled(true);
        if (!mounted) return;
        setIsEnabled(true);
        setStatusText(
          "Device allows notifications. Enabled in Nuubi to match."
        );

        // ensure push token saved to backend
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        const auth = await SecureStore.getItemAsync("token");
        await fetch(
          "https://coral-app-n96bn.ondigitalocean.app/settings/savepushtoken",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
            },
            body: JSON.stringify({ ...user, pushToken: token }),
          }
        );
      }
    };

    // run on mount
    reconcile();

    // also run when app returns to foreground
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") reconcile();
    });

    return () => {
      mounted = false;
      sub.remove();
    };
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
    (async () => {
      const backendEnabled = await getBackendEnabled();
      setIsEnabled(backendEnabled);
    })();
  }, []);

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
                  if (values.enabled) {
                    if (Platform.OS === "web") {
                      setStatusText(
                        "Your preference has been saved. To receive alerts, please make sure push notifications are turned on in your mobile device’s system settings."
                      );
                    } else {
                      const t = await registerForPushNotificationsAsync();
                      if (!t) {
                        setDenied(true);
                        setStatusText(
                          "Permission denied. You can enable notifications in device settings."
                        );
                        values.enabled = false; // flip it back off in UI
                        await setBackendEnabled(false); // update backend instead of SecureStore
                        return; // exit early, don’t call backend with enabled: true
                      } else {
                        setDenied(false);
                      }
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
                  {!!denied && (
                    <TouchableOpacity onPress={() => Linking.openSettings()}>
                      <Text style={{ color: "#2482AA", marginBottom: 16 }}>
                        Open device settings
                      </Text>
                    </TouchableOpacity>
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
