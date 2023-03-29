import * as React from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
const { formSchema, newPasswordSchema } = require("../validationSchema");
import { Formik, ErrorMessage } from "formik";

export default function ChangePasswordScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Change password",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      <View>
        <Formik
          initialValues={{ password: "", passattempt1: "", passattempt2: "" }}
          validationSchema={newPasswordSchema}
          onSubmit={(values, actions) => {
            const vals = { ...values };
            console.log("onsubmit is working");
            console.log(vals);
            console.log({ ...user, ...vals });
            actions.resetForm();
            fetch(
              "https://coral-app-n96bn.ondigitalocean.app/settings/updatepassword",
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
              <Text>Current password</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter password"
                onChangeText={props.handleChange("password")}
                value={props.values.password}
                secureTextEntry={true}
                marginBottom={10}
              />
              <Text>
                <ErrorMessage name="password" />
              </Text>
              <Text>New password</Text>
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
              <Text>New password</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Repeat new password"
                onChangeText={props.handleChange("passattempt2")}
                value={props.values.passattempt2}
                marginBottom={10}
              />
              <Text>
                <ErrorMessage name="passattempt2" />
              </Text>

              <TouchableOpacity
                style={globalStyles.primaryButton}
                onPress={props.handleSubmit}
              >
                <Text style={globalStyles.primaryButtonText}>
                  Update password
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={globalStyles.secondaryButton}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={globalStyles.secondaryButtonText}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}
