import * as React from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
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
          marginBottom: 400,
        }}
      >
        <Text
          style={{
            color: "red",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          {error}
        </Text>
        <View>
          <Formik
            initialValues={{ email: "" }}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              actions.resetForm();
              const email = vals.email;
              fetch(
                "https://coral-app-n96bn.ondigitalocean.app/settings/generatepasscode",
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ ...user, email }),
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
          {/* </View> */}
          <View style={{ marginVertical: 20 }}></View>
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
