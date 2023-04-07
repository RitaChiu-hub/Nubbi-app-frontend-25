import * as React from "react";
import { TextInput, View, Text, TouchableOpacity } from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { formSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen({ navigation }) {
  const { setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Log in",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.innerContainer}>
        <Formik
          initialValues={{ username: "Testuser", password: "testpass" }}
          //  initialValues={{ username: "", password: "" }}
          validationSchema={formSchema}
          onSubmit={(values, actions) => {
            const vals = { ...values };
            actions.resetForm();
            fetch(`https://coral-app-n96bn.ondigitalocean.app/auth/login`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(vals),
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
                  SecureStore.setItemAsync("token", data.token);
                }
              });
          }}
        >
          {(props) => (
            <View>
              <View style={{ marginHorizontal: 30 }}>
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  {error}
                </Text>
                <View style={{ marginVertical: 10 }}></View>
                <Text>Username or email</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Enter username or email"
                  onChangeText={props.handleChange("username")}
                  value={props.values.username}
                  marginBottom={10}
                />
                <Text>
                  <ErrorMessage name="username" />
                </Text>
                <Text>Password</Text>
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

                <View style={globalStyles.buttonContainer}>
                  <View>
                    <TouchableOpacity
                      style={globalStyles.secondaryButton}
                      onPress={() => navigation.navigate("SignUp")}
                    >
                      <Text style={globalStyles.secondaryButtonText}>
                        Sign up
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={globalStyles.primaryButton}
                      onPress={props.handleSubmit}
                    >
                      <Text style={globalStyles.primaryButtonText}>Log in</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={globalStyles.secondaryButton}
                  onPress={() => navigation.navigate("ForgotPasswordLoggedOut")}
                >
                  <Text style={globalStyles.secondaryButtonText}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}
