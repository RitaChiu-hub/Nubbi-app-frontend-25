import * as React from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
const { forgotPasswordSchema } = require("../validationSchema");
import { Formik, ErrorMessage } from "formik";

export default function ForgotPasswordScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  const generatePasscode = () => {
    const myNumber = Math.random().toString(10).substring(2, 8);
    const mypasscode = myNumber;
    fetch(
      "http://localhost:8080/settings/generatepasscode",
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
      title: "Forgot Password",
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
            marginTop: 20,
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ paddingVertical: 10 }}>
            Click this button to send a 6 digit passcode to the email associated
            with this account. Enter the 6 digit passcode and a new password
            below.
          </Text>
          <View>
            <TouchableOpacity
              style={globalStyles.primaryButton}
              onPress={generatePasscode}
            >
              <Text style={globalStyles.primaryButtonText}>Send passcode</Text>
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
                "http://localhost:8080/settings/forgotpassword",
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
                <Text>Enter the 6 digit passcode</Text>
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
                  placeholder="Enter passcode"
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
                <Text>Please enter your desired new password</Text>
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
                <Text>Please enter your desired new password again</Text>
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
  );
}
