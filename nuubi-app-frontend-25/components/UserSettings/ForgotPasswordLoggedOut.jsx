import * as React from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
const { forgotPasswordSchema } = require("../validationSchema");
import { Formik, ErrorMessage } from "formik";
import { loginStyles } from "../../styles/loginStyles";

export default function ForgotPasswordLoggedOut({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [enteredEmail, setEnteredEmail] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Reset Password</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView
      style={{
        backgroundColor: "#fdfdfd",
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
        <Text
          style={{
            color: "red",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          {error}
        </Text>

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
              color: enteredEmail ? "#006400" : "#111111",
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
              fetch("https://coral-app-n96bn.ondigitalocean.app/settings/generatepasscode", {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...user, email }),
              })
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
                  // else if (data.loggedIn) {
                  //   SecureStore.setItemAsync("token", data.token);
                  // }
                });
            }}
          >
            {(props) => (
              <View>
                <Text style={loginStyles.loginLabelText}>Email:</Text>
                <TextInput
                  style={styles.loginInput}
                  placeholder="School or Personal Email"
                  onChangeText={props.handleChange("email")}
                  value={props.values.email}
                />
                <View style={{ marginVertical: 5 }}></View>
                <View>
                  <TouchableOpacity
                    style={styles.loginButton}
                    accessibilityRole="button"
                    onPress={props.handleSubmit}
                  >
                    <Text style={loginStyles.loginButtonText}>
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
              fetch("https://coral-app-n96bn.ondigitalocean.app/settings/forgotpassword", {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...user, ...vals }),
              })
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
                  // else if (data.loggedIn) {
                  //   SecureStore.setItemAsync("token", data.token);
                  // }
                });
            }}
          >
            {(props) => (
              <View>
                <Text style={loginStyles.loginLabelText}>Passcode:</Text>
                <TextInput
                  style={styles.loginInput}
                  placeholder="Enter 6 Digit Passcode"
                  onChangeText={props.handleChange("passcode")}
                  value={props.values.passcode}
                />
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="passcode" />
                </Text>
                <Text style={loginStyles.loginLabelText}>New Password:</Text>
                <TextInput
                  style={styles.loginInput}
                  placeholder="Enter New Password"
                  secureTextEntry={true}
                  onChangeText={props.handleChange("passattempt1")}
                  value={props.values.passattempt1}
                />
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="passattempt1" />
                </Text>
                <Text style={loginStyles.loginLabelText}>
                  Repeat New Password:
                </Text>
                <TextInput
                  style={styles.loginInput}
                  placeholder="Repeat New Password"
                  secureTextEntry={true}
                  onChangeText={props.handleChange("passattempt2")}
                  value={props.values.passattempt2}
                />
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="passattempt2" />
                </Text>
                <View style={{ marginVertical: 5 }}></View>
                <View>
                  <TouchableOpacity
                    style={styles.loginButton}
                    accessibilityRole="button"
                    onPress={props.handleSubmit}
                  >
                    <Text style={loginStyles.loginButtonText}>
                      Reset password
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text
                      style={{
                        textAlign: "center",
                        marginTop: 30,
                        color: "#2482AA",
                        textDecorationLine: "underline",
                      }}
                    >
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

const deviceWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  loginInput: {
    borderWidth: 1,
    borderColor: "#C0C0C0",
    backgroundColor: "#EBEBEB",
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#767676",
    padding: 12,
    borderRadius: 10,
    // alignItems: "center",
    // justifyContent: "center",
    marginVertical: 5,
    width: deviceWidth * 0.9,
  },
  loginButton: {
    // alignItems: "center",
    // justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 60,
    elevation: 3,
    backgroundColor: "#2482AA",
    width: deviceWidth * 0.9,
  },
});
