import * as React from "react";
import {
  Button,
  TextInput,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
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
    <View style={globalStyles.container}>
      <View
        style={{
          marginVertical: 20,
          flex: 1,
          backgroundColor: "#fdfdfd",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Formik
          initialValues={{ passcode: "", admin: "" }}
          onSubmit={(values, actions) => {
            const vals = { ...values };
            actions.resetForm();
            fetch(
              `https://coral-app-n96bn.ondigitalocean.app/groups/joingroupwithpasscode`,
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
                  SecureStore.setItemAsync("token", data.token);
                }
              });
          }}
        >
          {(props) => (
            <View style={{ flex: 1, justifyContent: "flex-start" }}>
              <Text>{error}</Text>
              <Text>Passcode</Text>
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
              <Text>Admin username</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter admin username"
                onChangeText={props.handleChange("admin")}
                value={props.values.admin}
                marginBottom={10}
              />
              <Text>
                <ErrorMessage name="admin" />
              </Text>

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
  );
}
