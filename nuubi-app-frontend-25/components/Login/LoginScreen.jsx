import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
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
      title: "Log In",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      <ScrollView>
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
                    placeholder="Enter username or email"
                    onChangeText={props.handleChange("username")}
                    value={props.values.username}
                    marginBottom={10}
                  />
                  <Text
                    style={{
                      color: "red",
                      textAlign: "center",
                    }}
                  >
                    <ErrorMessage name="username" />
                  </Text>
                  <Text>Password</Text>
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
                    placeholder="Enter password"
                    onChangeText={props.handleChange("password")}
                    value={props.values.password}
                    secureTextEntry={true}
                    marginBottom={10}
                  />
                  <Text
                    style={{
                      color: "red",
                      textAlign: "center",
                    }}
                  >
                    <ErrorMessage name="password" />
                  </Text>
                  <View style={{ marginVertical: 5 }}></View>
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
                        <Text style={globalStyles.primaryButtonText}>
                          Log in
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={globalStyles.secondaryButton}
                    onPress={() =>
                      navigation.navigate("ForgotPasswordLoggedOut")
                    }
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
      </ScrollView>
    </View>
  );
}
