import * as React from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
const { changeUsernameSchema } = require("../validationSchema");
import { Formik, ErrorMessage } from "formik";

export default function ChangeUsernameScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Change Username",
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
          marginVertical: 50,
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#fdfdfd",
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            Your current username is {user.username}.
          </Text>
          <View style={{ marginVertical: 10 }}></View>
          <Text style={{ fontSize: 14 }}>Your new username must have: </Text>
          <Text> {"\u2022"} 3 characters minimum </Text>
          <Text> {"\u2022"} 28 characters maximum </Text>
          <Text> {"\u2022"} no whitespace or special characters</Text>
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={changeUsernameSchema}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              const newusername = vals.username;
              const passattempt = vals.password;
              actions.resetForm();
              fetch(
                "https://coral-app-n96bn.ondigitalocean.app/settings/updateusername",
                //  "https://coral-app-n96bn.ondigitalocean.app/settings/updateusername",
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ ...user, newusername, passattempt }),
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
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  {error}
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
                    marginBottom: 5,
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
                <Text>New username</Text>
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
                  placeholder="Enter username"
                  onChangeText={props.handleChange("username")}
                  value={props.values.username}
                />
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="username" />
                </Text>
                <View style={{ marginVertical: 5 }}></View>
                <TouchableOpacity
                  style={globalStyles.primaryButton}
                  onPress={props.handleSubmit}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    Update username
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
