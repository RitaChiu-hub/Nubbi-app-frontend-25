import * as React from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
const { formSchema } = require("../validationSchema");
import { Formik, ErrorMessage } from "formik";

export default function DeleteAccountScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Delete account",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      <View>
        <Formik
          initialValues={{ passattempt: "" }}
          onSubmit={(values, actions) => {
            const vals = { ...values };
            const passattempt = vals.passattempt;
            actions.resetForm();
            fetch(
              "https://coral-app-n96bn.ondigitalocean.app/settings/delete",
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
                console.log(data);
                setUser({ ...data });
                if (data.status) {
                  setError(data.status);
                } else if (data.loggedIn) {
                  SecureStore.deleteItemAsync("userToken");
                  setUser({ loggedIn: false });
                }
              });
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <Text>{error}</Text>
              <Text>Please enter your password to verify your identity</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter password"
                onChangeText={handleChange("passattempt")}
                onBlur={handleBlur("passattempt")}
                value={values.passattempt}
                secureTextEntry={true}
                marginBottom={10}
              />
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
  );
}
