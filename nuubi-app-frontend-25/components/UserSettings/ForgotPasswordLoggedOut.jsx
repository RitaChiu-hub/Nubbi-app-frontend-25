import * as React from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
const { forgotPasswordSchema } = require("../validationSchema");
import { Formik, ErrorMessage } from "formik";

export default function ForgotPasswordLoggedOut({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [enteredEmail, setEnteredEmail] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Reset Password</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView
      style={{
        backgroundColor: "#fbfbfb",
        flex: 1,
      }}
    >
      <View
        style={{
          paddingHorizontal: 0,
          paddingVertical: 0,
          alignItems: "center",
        }}
      >
        <Text style={globalStyles.captionError}>{error}</Text>

        <View
          style={{
            flex: 0.2,
            backgroundColor: enteredEmail ? "#33FFB6" : "white",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 25,
              fontWeight: "500",
              color: enteredEmail ? "#006400" : "#050505",
            }}
          >
            {enteredEmail ? "Check Your Email" : "Enter Your Email"}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              color: enteredEmail ? "#006400" : "#333",
            }}
          >
            {enteredEmail
              ? "We've sent instructions on reseting your password. If you don't receive an email, please check your spam."
              : "We will send you instructions on how to reset your password"}
          </Text>
          <View
            style={{ flex: 0.35, marginTop: 16, paddingHorizontal: 20 }}
          ></View>
          <Formik
            initialValues={{ email: "" }}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              actions.resetForm();
              const email = vals.email;
              fetch(
                "https://coral-app-n96bn.ondigitalocean.app/settings/generatepasscode",
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ ...user, email }),
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
                  console.log(data);
                  setUser({ ...data });
                  if (data.status) {
                    setError(data.status);
                  }
                });
            }}
          >
            {(props) => (
              <View>
                <Text style={globalStyles.textInputLabel}>Email:</Text>
                <TextInput
                  style={globalStyles.textInput}
                  placeholder="School or Personal Email"
                  onChangeText={props.handleChange("email")}
                  value={props.values.email}
                />
                <View style={{ marginVertical: 5 }}></View>
                <View>
                  <TouchableOpacity
                    style={globalStyles.primaryButton}
                    accessibilityRole="button"
                    onPress={props.handleSubmit}
                  >
                    <Text style={globalStyles.primaryButtonText}>
                      Send passcode
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
          {/* </View> */}
          <View style={{ marginVertical: 16 }}></View>
          <Formik
            initialValues={{
              passcode: "",
              passattempt1: "",
              passattempt2: "",
            }}
            validationSchema={forgotPasswordSchema}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              actions.resetForm();
              fetch(
                "https://coral-app-n96bn.ondigitalocean.app/settings/forgotpassword",
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
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
                  console.log(data);
                  setUser({ ...data });
                  if (data.status) {
                    setError(data.status);
                  }
                });
            }}
          >
            {(props) => (
              <View>
                <Text style={globalStyles.textInputLabel}>Passcode:</Text>
                <TextInput
                  style={globalStyles.textInput}
                  placeholder="Enter 6 Digit Passcode"
                  onChangeText={props.handleChange("passcode")}
                  value={props.values.passcode}
                />
                <Text style={globalStyles.captionError}>
                  <ErrorMessage name="passcode" />
                </Text>
                <Text style={globalStyles.textInputLabel}>New Password:</Text>
                <TextInput
                  style={globalStyles.textInput}
                  placeholder="Enter New Password"
                  secureTextEntry={true}
                  onChangeText={props.handleChange("passattempt1")}
                  value={props.values.passattempt1}
                />
                <Text style={globalStyles.captionError}>
                  <ErrorMessage name="passattempt1" />
                </Text>
                <Text style={globalStyles.textInputLabel}>
                  Repeat New Password:
                </Text>
                <TextInput
                  style={globalStyles.textInput}
                  placeholder="Repeat New Password"
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
                    accessibilityRole="button"
                    onPress={props.handleSubmit}
                  >
                    <Text style={globalStyles.primaryButtonText}>
                      Reset password
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={globalStyles.linkButton}
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={globalStyles.captionLinkBlue}>
                      Return to Sign In
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
