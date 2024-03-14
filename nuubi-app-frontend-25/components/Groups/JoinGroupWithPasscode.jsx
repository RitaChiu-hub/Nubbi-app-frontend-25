import * as React from "react";
import {
  Button,
  TextInput,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

export default function JoinGroupWithPasscode({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Join group with passcode",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView style={{ backgroundColor: "#fdfdfd" }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fdfdfd",
          alignItems: "center",
        }}
      >
        <View
          style={{
            marginVertical: 20,
            // flex: 1,
            // backgroundColor: "#fdfdfd",
            // alignItems: "center",
            // justifyContent: "center",
          }}
        >
          <Formik
            initialValues={{ passcode: "", admin: "" }}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              actions.resetForm();
              fetch(
                `http://localhost:8080/groups/joingroupwithpasscode`,
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
              <View style={{ flex: 1, justifyContent: "flex-start" }}>
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  {error}
                </Text>
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
                    marginBottom: 5,
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
                <Text>Admin username</Text>
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
                  placeholder="Enter admin username"
                  onChangeText={props.handleChange("admin")}
                  value={props.values.admin}
                />
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="admin" />
                </Text>
                <View style={{ marginVertical: 5 }}></View>
                <TouchableOpacity
                  style={globalStyles.primaryButton}
                  onPress={props.handleSubmit}
                >
                  <Text style={globalStyles.primaryButtonText}>Join group</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </ScrollView>
  );
}
