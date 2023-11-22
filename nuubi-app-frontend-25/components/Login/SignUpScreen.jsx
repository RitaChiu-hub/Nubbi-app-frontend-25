import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { formSignupSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

export default function SignUpScreen({ navigation }) {
  const { setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Sign Up",
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
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
          marginBottom: 400,
        }}
      >
        <Formik
          // initialValues={{
          //   email: "",
          //   password: "password",
          //   password2: "password",
          // }}
          initialValues={{
            email: "",
            password: "",
            password2: "",
          }}
          validationSchema={formSignupSchema}
          onSubmit={(values, actions) => {
            values.email = values.email.trim();
            const vals = { ...values };
            actions.resetForm();
            fetch("https://coral-app-n96bn.ondigitalocean.app/auth/signup", {
              // fetch("https://coral-app-n96bn.ondigitalocean.app/auth/signup", {
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
                setUser({ ...data });
                if (Platform.OS === "web") {
                  localStorage.setItem("token", data.token);
                } else {
                  SecureStore.setItemAsync("token", data.token);
                }
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
                    marginVertical: 5,
                  }}
                  placeholder="Enter school email (me@school.edu)"
                  onChangeText={props.handleChange("email")}
                  value={props.values.email}
                  marginBottom={10}
                />
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="email" />
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
                  placeholder="Repeat password"
                  onChangeText={props.handleChange("password2")}
                  value={props.values.password2}
                  secureTextEntry={true}
                  marginBottom={10}
                />
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="password2" />
                </Text>

                <View
                  style={{
                    padding: 10,
                    fontSize: 18,
                    width: "100%",
                    alignItems: "stretch",
                    marginBottom: 5,
                  }}
                >
                  <Text>Password must contain: </Text>
                  <Text>• 8 to 28 characters</Text>
                  <Text>• At least one lowercase letter</Text>
                  <Text>• At least one uppercase letter</Text>
                  <Text>• At least one number</Text>
                  <Text>• At least one special character</Text>
                </View>
                <View style={{ marginVertical: 5 }}></View>
                <View style={globalStyles.buttonContainer}>
                  <View>
                    <TouchableOpacity
                      style={globalStyles.secondaryButton}
                      onPress={() => navigation.navigate("Login")}
                    >
                      <Text style={globalStyles.secondaryButtonText}>
                        Log in
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={globalStyles.primaryButton}
                      onPress={props.handleSubmit}
                    >
                      <Text style={globalStyles.primaryButtonText}>
                        Sign up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}
