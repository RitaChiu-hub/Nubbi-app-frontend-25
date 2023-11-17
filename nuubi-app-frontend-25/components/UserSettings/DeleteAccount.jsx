import * as React from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import { Formik, ErrorMessage } from "formik";

export default function DeleteAccountScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Delete Account",
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
        }}
      >
        <View
          style={{
            margin: 20,
          }}
        >
          <Formik
            initialValues={{ passattempt: "" }}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              const passattempt = vals.passattempt;
              actions.resetForm();
              fetch(
                "http://localhost:8080/settings/delete",
                //  "http://localhost:8080/settings/delete",
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ ...user, passattempt }),
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
                  setUser({ ...data });
                  if (Platform.OS === "web") {
                    localStorage.removeItem("token");
                  } else {
                    SecureStore.deleteItemAsync("token");
                  }
                  setUser({ token: null });
                  socket.disconnect();
                  if (data.status) {
                    setError(data.status);
                  }
                  // else if (data.loggedIn) {
                  //   if (Platform.OS === "web") {
                  //     localStorage.removeItem("token");
                  //   } else {
                  //     SecureStore.deleteItemAsync("token");
                  //   }
                  //   socket.disconnect();
                  // }
                });
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View>
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  {error}
                </Text>
                <Text>Please enter your password to verify your identity</Text>
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
                  onChangeText={handleChange("passattempt")}
                  onBlur={handleBlur("passattempt")}
                  value={values.passattempt}
                  secureTextEntry={true}
                />
                <View style={{ marginVertical: 5 }}></View>
                <View>
                  <TouchableOpacity
                    style={globalStyles.primaryButton}
                    onPress={handleSubmit}
                  >
                    <Text style={globalStyles.primaryButtonText}>
                      Delete account permanently {"&"} sign out
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
