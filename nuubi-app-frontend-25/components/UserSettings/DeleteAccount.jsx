import * as React from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import { Formik, ErrorMessage } from "formik";
import socket from "../../socket";

export default function DeleteAccountScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingRegular}>Delete Account</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView
      style={{
        backgroundColor: "#fdfdfd",
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#fdfdfd",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            margin: 20,
          }}
        >
          <Formik
            initialValues={{ passattempt: "" }}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              const passattempt = vals.passattempt;
              actions.resetForm();
              fetch(
                // "https://coral-app-n96bn.ondigitalocean.app/settings/delete",
                "http://localhost:8080/settings/delete",
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ ...user, passattempt }),
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

                  if (data.status) {
                    setError(data.status);
                  }
                  if (data.status == "Success") {
                    setUser({ ...data });
                    if (Platform.OS === "web") {
                      localStorage.removeItem("token");
                    } else {
                      SecureStore.deleteItemAsync("token");
                    }
                    setUser({ token: null });
                    socket.disconnect();
                  }
                });
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View>
                <Text style={globalStyles.captionError}>{error}</Text>
                <Text style={globalStyles.textInputLabel}>
                  Enter your password:
                </Text>
                <TextInput
                  style={globalStyles.textInput}
                  placeholder="Enter password"
                  onChangeText={handleChange("passattempt")}
                  onBlur={handleBlur("passattempt")}
                  value={values.passattempt}
                  secureTextEntry={true}
                />
                <View style={{ marginVertical: 5 }}></View>
                <View>
                  <TouchableOpacity
                    style={globalStyles.primaryButton}
                    onPress={handleSubmit}
                  >
                    <Text style={globalStyles.primaryButtonText}>
                      Delete Account Permanently
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </ScrollView>
  );
}
