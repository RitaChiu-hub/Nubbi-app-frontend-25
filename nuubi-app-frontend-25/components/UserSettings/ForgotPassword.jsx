import * as React from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import { loginStyles } from "../../styles/loginStyles";
const { forgotPasswordSchema } = require("../validationSchema");
import { Formik, ErrorMessage } from "formik";

export default function ForgotPasswordScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  const generatePasscode = () => {
    const myNumber = Math.random().toString(10).substring(2, 8);
    const mypasscode = myNumber;
    fetch(
      "https://coral-app-n96bn.ondigitalocean.app/settings/generatepasscode",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
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
        console.log(data);
        setUser({ ...data });
        if (data.status) {
          setError(data.status);
        }
        // else if (data.loggedIn) {
        //   SecureStore.setItemAsync("token", data.token);
        // }
      });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Forgot Password</Text>
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
          marginTop: 20,
          marginBottom: 400,
        }}
      >
        <View
          style={{
            backgroundColor: "#fdfdfd",
            paddingHorizontal: 20,
          }}
        >
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
            Click this button to send a 6 digit passcode to the email associated
            with this account. Enter the 6 digit passcode and a new password
            below.
          </Text>
          <View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={generatePasscode}
            >
              <Text style={loginStyles.loginButtonText}>Send passcode</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginVertical: 5 }}></View>
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
                  }
                  // else if (data.loggedIn) {
                  //   SecureStore.setItemAsync("token", data.token);
                  // }
                });
            }}
          >
            {(props) => (
              <View>
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  {error}
                </Text>
                <Text
                  style={[
                    globalStyles.h2HeadingMedium,
                    {
                      fontSize: 22,
                      marginTop: 10,
                      color: "#606060",
                    },
                  ]}
                >
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
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="passcode" />
                </Text>
                <Text
                  style={[
                    globalStyles.h2HeadingMedium,
                    {
                      fontSize: 22,
                      marginTop: 10,
                      color: "#606060",
                    },
                  ]}
                >
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
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="passattempt1" />
                </Text>
                <Text
                  style={[
                    globalStyles.h2HeadingMedium,
                    {
                      fontSize: 22,
                      marginTop: 10,
                      color: "#606060",
                    },
                  ]}
                >
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
                    onPress={props.handleSubmit}
                  >
                    <Text style={loginStyles.loginButtonText}>
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
