import * as React from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
const { forgotPasswordSchema } = require("../validationSchema");
import { Formik, ErrorMessage } from "formik";
import * as SecureStore from "expo-secure-store";

export default function ForgotPasswordScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  const generatePasscode = async () => {
    const myNumber = Math.random().toString(10).substring(2, 8);
    const mypasscode = myNumber;
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    fetch(
      "http://localhost:8080/settings/generatepasscode",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...user, mypasscode }),
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
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>
          Forgot or Create Nuubi Password
        </Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

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
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 140,
          }}
        >
          <View style={globalStyles.widthContainer}>
            <Text
              style={[
                {
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: "#333",
                  padding: 14,
                },
                Platform.OS === "web" && {
                  outlineStyle: "none",
                },
              ]}
            >
              If you signed up through Canvas or forgot your password, you’ll
              need to set a Nuubi password to log into the mobile app or change
              account settings like your username.
            </Text>
            <Text
              style={[
                {
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: "#333",
                  padding: 14,
                },
                Platform.OS === "web" && {
                  outlineStyle: "none",
                },
              ]}
            >
              Tap the button to send a 6-digit passcode to your email. Then
              enter the code and set a new password below.
            </Text>
            <View>
              <TouchableOpacity
                style={globalStyles.primaryButton}
                onPress={generatePasscode}
              >
                <Text style={globalStyles.primaryButtonText}>
                  Send passcode
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 5 }}></View>
            <Formik
              initialValues={{
                passcode: "",
                passattempt1: "",
                passattempt2: "",
              }}
              validationSchema={forgotPasswordSchema}
              onSubmit={async (values, actions) => {
                const vals = { ...values };
                actions.resetForm();
                const token =
                  Platform.OS !== "web"
                    ? await SecureStore.getItemAsync("token")
                    : null; // Get token only on mobile
                fetch(
                  "http://localhost:8080/settings/forgotpassword",
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
                <View>
                  <Text style={globalStyles.captionError}>{error}</Text>
                  <Text style={globalStyles.textInputLabel}>
                    Enter the 6 digit passcode
                  </Text>
                  <TextInput
                    style={[
                      {
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: "#C0C0C0",
                        backgroundColor: "#EBEBEB",
                        fontFamily: "Poppins_400Regular",
                        fontSize: 14,
                        color: "#767676",
                        padding: 14,
                        borderRadius: 10,
                        width: "100%",
                        alignItems: "stretch",
                      },
                      Platform.OS === "web" && {
                        outlineStyle: "none",
                      },
                    ]}
                    placeholder="Enter 6 digit passcode"
                    onChangeText={props.handleChange("passcode")}
                    value={props.values.passcode}
                  />
                  <Text style={globalStyles.captionError}>
                    <ErrorMessage name="passcode" />
                  </Text>
                  <Text style={globalStyles.textInputLabel}>
                    Enter new password
                  </Text>
                  <TextInput
                    style={[
                      {
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: "#C0C0C0",
                        backgroundColor: "#EBEBEB",
                        fontFamily: "Poppins_400Regular",
                        fontSize: 14,
                        color: "#767676",
                        padding: 14,
                        borderRadius: 10,
                        width: "100%",
                        alignItems: "stretch",
                      },
                      Platform.OS === "web" && {
                        outlineStyle: "none",
                      },
                    ]}
                    placeholder="Enter new password"
                    secureTextEntry={true}
                    onChangeText={props.handleChange("passattempt1")}
                    value={props.values.passattempt1}
                  />
                  <Text style={globalStyles.captionError}>
                    <ErrorMessage name="passattempt1" />
                  </Text>
                  <Text style={globalStyles.textInputLabel}>
                    Confirm new password
                  </Text>
                  <TextInput
                    style={[
                      {
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: "#C0C0C0",
                        backgroundColor: "#EBEBEB",
                        fontFamily: "Poppins_400Regular",
                        fontSize: 14,
                        color: "#767676",
                        padding: 14,
                        borderRadius: 10,
                        width: "100%",
                        alignItems: "stretch",
                      },
                      Platform.OS === "web" && {
                        outlineStyle: "none",
                      },
                    ]}
                    placeholder="Enter new password again"
                    secureTextEntry={true}
                    onChangeText={props.handleChange("passattempt2")}
                    value={props.values.passattempt2}
                  />
                  <Text style={globalStyles.captionError}>
                    <ErrorMessage name="passattempt2" />
                  </Text>
                  <View style={{ marginVertical: 5 }}></View>
                  <View>
                    <TouchableOpacity
                      style={globalStyles.primaryButton}
                      onPress={props.handleSubmit}
                    >
                      <Text style={globalStyles.primaryButtonText}>
                        Reset password
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
