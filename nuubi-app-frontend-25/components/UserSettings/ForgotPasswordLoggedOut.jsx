import * as React from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
const { forgotPasswordSchema } = require("../validationSchema");
import { Formik, ErrorMessage } from "formik";

export default function ForgotPasswordLoggedOut({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Forgot Password",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{
        flex: 1,
        backgroundColor: "#fdfdfd",
        alignItems: "center",
      }}
    >
      <View
        style={{
          marginTop: StatusBar.currentHeight || 15,
        }}
      >
        <Text
          style={{
            color: "red",
            textAlign: "center",
          }}
        >
          {error}
        </Text>

        <View
          style={{
            backgroundColor: "#fdfdfd",
            marginTop: 100,
          }}
        >
          <Formik
            initialValues={{ email: "" }}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              actions.resetForm();
              const myNumber = Math.random().toString(10).substring(2, 8);
              const mypasscode = myNumber;
              const email = vals.email;
              fetch(
                "https://coral-app-n96bn.ondigitalocean.app/settings/generatepasscode",
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ ...user, email, mypasscode }),
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
                  } else if (data.loggedIn) {
                    console.log("no errors I guess");
                  }
                });
            }}
          >
            {(props) => (
              <View>
                <View style={{ marginVertical: -35 }}></View>

                <Text>Email</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    padding: 10,
                    fontSize: 18,
                    borderRadius: 6,
                    width: "100%",
                    alignItems: "stretch",
                  }}
                  placeholder="Enter email"
                  onChangeText={props.handleChange("email")}
                  value={props.values.email}
                />
                <View style={{ marginVertical: 5 }}></View>
                <View>
                  <TouchableOpacity
                    style={globalStyles.primaryButton}
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
          <View style={{ marginVertical: 20 }}></View>
          <Formik
            initialValues={{ passcode: "", passattempt1: "", passattempt2: "" }}
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
                  } else if (data.loggedIn) {
                    console.log("no errors I guess");
                  }
                });
            }}
          >
            {(props) => (
              <View>
                <Text>Passcode</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    padding: 10,
                    fontSize: 18,
                    borderRadius: 6,
                    width: "100%",
                    alignItems: "stretch",
                    marginVertical: 5,
                  }}
                  placeholder="Enter 6 digit passcode"
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
                <Text>New password</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    padding: 10,
                    fontSize: 18,
                    borderRadius: 6,
                    width: "100%",
                    alignItems: "stretch",
                    marginVertical: 5,
                  }}
                  placeholder="Enter new password"
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
                <Text>New password</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    padding: 10,
                    fontSize: 18,
                    borderRadius: 6,
                    width: "100%",
                    alignItems: "stretch",
                    marginVertical: 5,
                  }}
                  placeholder="Repeat new password"
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
    </KeyboardAvoidingView>
  );
}
