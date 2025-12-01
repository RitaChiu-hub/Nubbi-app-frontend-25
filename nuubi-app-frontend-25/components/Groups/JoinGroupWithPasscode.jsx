import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
import FAIcon from "@expo/vector-icons/FontAwesome";
import config from "../../config";

export default function JoinGroupWithPasscode({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Join Private Group</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setError(null); // clear status message on screen focus
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={{ backgroundColor: "#fbfbfb" }}>
      {Platform.OS === "web" && (
        <TouchableOpacity
          onPress={navigation.goBack}
          accessibilityRole="button"
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: 16,
            paddingVertical: 8,
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
          }}
        >
          <FAIcon
            name="chevron-left"
            size={16}
            color="#2482AA"
            style={{ marginRight: 4 }}
          />
          <Text
            style={{
              color: "#2482AA",
              fontSize: 18,
              fontFamily: "Poppins_600SemiBold",
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
      )}
      <View
        style={{
          flex: 1,
          backgroundColor: "#fbfbfb",
          alignItems: "center",
        }}
      >
        <View
          style={{
            marginVertical: 20,
          }}
        >
          <Formik
            initialValues={{ passcode: "", admin: "" }}
            onSubmit={async (values, actions) => {
              const vals = { ...values };
              actions.resetForm();
              const token =
                Platform.OS !== "web"
                  ? await SecureStore.getItemAsync("token")
                  : null; // Get token only on mobile
              fetch(
                `${config.API_BASE_URL}/groups/joingroupwithpasscode`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                  body: JSON.stringify({ ...user, ...vals }),
                }
              )
                .catch((err) => {
                  return;
                })
                .then((res) => {
                  if (!res || !res.ok || res.status >= 400) {
                    return;
                  }
                  return res.json();
                })
                .then((data) => {
                  if (!data) return;
                  setUser({ ...data });
                  if (data.status) {
                    setError(data.status);
                  }
                });
            }}
          >
            {(props) => (
              <View style={{ flex: 1, justifyContent: "flex-start" }}>
                <Text style={globalStyles.captionError}>{error}</Text>

                <Text style={globalStyles.textInputLabel}>Admin Username</Text>
                <TextInput
                  style={globalStyles.textInput}
                  placeholder="Enter Admin Username"
                  onChangeText={props.handleChange("admin")}
                  value={props.values.admin}
                />
                <Text style={globalStyles.captionError}>
                  <ErrorMessage name="admin" />
                </Text>

                <Text style={globalStyles.textInputLabel}>Passcode</Text>
                <TextInput
                  style={globalStyles.textInput}
                  placeholder="Enter Passcode"
                  onChangeText={props.handleChange("passcode")}
                  value={props.values.passcode}
                />
                <Text style={globalStyles.captionError}>
                  <ErrorMessage name="passcode" />
                </Text>

                <View style={{ marginVertical: 5 }}></View>
                <TouchableOpacity
                  style={globalStyles.primaryButton}
                  onPress={props.handleSubmit}
                >
                  <Text style={globalStyles.primaryButtonText}>Join Group</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </ScrollView>
  );
}
