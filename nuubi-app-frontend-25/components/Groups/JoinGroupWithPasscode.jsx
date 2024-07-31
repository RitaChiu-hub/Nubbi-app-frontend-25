import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";

export default function JoinGroupWithPasscode({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Join Private Group</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView style={{ backgroundColor: "#fbfbfb" }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fbfbfb",
          alignItems: "center",
        }}
      >
        <View
          style={{
            marginVertical: 20,
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
                  }
                  // else if (data.loggedIn) {
                  //   SecureStore.setItemAsync("token", data.token);
                  // }
                });
            }}
          >
            {(props) => (
              <View style={{ flex: 1, justifyContent: "flex-start" }}>
                <Text style={globalStyles.captionError}>{error}</Text>
                <Text style={globalStyles.textInputLabel}>Passcode</Text>
                <TextInput
                  style={globalStyles.textInput}
                  placeholder="Enter Passcode"
                  onChangeText={props.handleChange("passcode")}
                  value={props.values.passcode}
                />
                <Text style={globalStyles.captionError}>
                  <ErrorMessage name="passcode" />
                </Text>
                <Text style={globalStyles.textInputLabel}>Admin Username</Text>
                <TextInput
                  style={globalStyles.textInput}
                  placeholder="Enter Admin Username"
                  onChangeText={props.handleChange("admin")}
                  value={props.values.admin}
                />
                <Text style={globalStyles.captionError}>
                  <ErrorMessage name="admin" />
                </Text>
                <View style={{ marginVertical: 5 }}></View>
                <TouchableOpacity
                  style={globalStyles.primaryButton}
                  onPress={props.handleSubmit}
                >
                  <Text style={globalStyles.primaryButtonText}>Join Group</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </ScrollView>
  );
}
