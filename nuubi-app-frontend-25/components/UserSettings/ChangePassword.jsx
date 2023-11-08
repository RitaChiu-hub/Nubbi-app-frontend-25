import * as React from "react";
import {
  Text,
  View,
  ScrollView,
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
      title: "Change Password",
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
          marginBottom: 50,
        }}
      >
        <View
          style={{
            backgroundColor: "#fdfdfd",
          }}
        >
          <Formik
            initialValues={{ password: "", passattempt1: "", passattempt2: "" }}
            validationSchema={newPasswordSchema}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              actions.resetForm();
              fetch("http://localhost:8080/settings/updatepassword", {
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
                  } else if (data.loggedIn) {
                    console.log("no errors I guess");
                  }
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
                <Text>Current password</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    padding: 10,
                    fontSize: 18,
                    borderRadius: 6,
                    width: "100%",
                    alignItems: "stretch",
                    marginBottom: 5,
                  }}
                  placeholder="Enter password"
                  onChangeText={props.handleChange("password")}
                  value={props.values.password}
                  secureTextEntry={true}
                />
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="password" />
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
                    marginBottom: 5,
                  }}
                  placeholder="Enter new password"
                  onChangeText={props.handleChange("passattempt1")}
                  value={props.values.passattempt1}
                  secureTextEntry={true}
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
                    marginBottom: 5,
                  }}
                  placeholder="Repeat new password"
                  onChangeText={props.handleChange("passattempt2")}
                  value={props.values.passattempt2}
                  secureTextEntry={true}
                  marginBottom={10}
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
    </ScrollView>
  );
}
