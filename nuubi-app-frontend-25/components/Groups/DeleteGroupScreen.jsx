import * as React from "react";
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import { Formik, ErrorMessage } from "formik";

export default function DeleteGroupScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingRegular}>Delete Group</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fdfdfd",
        alignItems: "center",
      }}
    >
      <View
        style={{
          marginTop: 20,
        }}
      >
        <Formik
          initialValues={{ passattempt: "" }}
          onSubmit={(values, actions) => {
            const vals = { ...values };
            const passattempt = vals.passattempt;
            actions.resetForm();
            fetch(
              "https://coral-app-n96bn.ondigitalocean.app/groups/deletegroup",
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...user,
                  ...vals,
                }),
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
                  if (data.status === "Success") {
                    navigation.navigate("Home");
                  }
                }
                // else if (data.loggedIn) {
                //   SecureStore.setItemAsync("token", data.token);
                // }
              });
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <Text style={globalStyles.captionError}>{error}</Text>
              <Text style={globalStyles.textInputLabel}>
                Enter Password for Verification:
              </Text>
              <TextInput
                style={[globalStyles.textInput, { minHeight: 48 }]}
                placeholder="Enter Password"
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
                    Delete group permanently
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
