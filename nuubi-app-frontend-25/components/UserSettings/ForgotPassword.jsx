import * as React from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
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
        } else if (data.loggedIn) {
          console.log("no errors I guess");
        }
      });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Forgot password",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView behavior="padding" style={globalStyles.container}>
      <View>
        <Text
          style={{ fontWeight: "bold", maxWidth: "90%", paddingBottom: 20 }}
        >
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
      </View>
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
            <Text>{error}</Text>
            <Text>Enter the 6 digit passcode</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter passcode"
              onChangeText={props.handleChange("passcode")}
              value={props.values.passcode}
              marginBottom={10}
            />
            <Text>
              <ErrorMessage name="passcode" />
            </Text>
            <Text>Please enter your desired new password</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter new password"
              onChangeText={props.handleChange("passattempt1")}
              value={props.values.passattempt1}
              marginBottom={10}
            />
            <Text>
              <ErrorMessage name="passattempt1" />
            </Text>
            <Text>Please enter your desired new password again</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter new password again"
              onChangeText={props.handleChange("passattempt2")}
              value={props.values.passattempt2}
              marginBottom={10}
            />
            <Text>
              <ErrorMessage name="passattempt2" />
            </Text>
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
    </KeyboardAvoidingView>
  );
}
