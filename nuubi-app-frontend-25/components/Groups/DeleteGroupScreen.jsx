import * as React from "react";
import { API_URL } from "../../config";
import { apiFetch } from "../../api/api";
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
        <Text style={globalStyles.h3HeadingWhite}>Delete Group</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fbfbfb",
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
          onSubmit={async (values, actions) => {
            const vals = { ...values };
            const passattempt = vals.passattempt;
            actions.resetForm();
            const token =
              Platform.OS !== "web"
                ? await SecureStore.getItemAsync("token")
                : null; // Get token only on mobile

              try {
                const data = await apiFetch(`${API_URL}/groups/mygroups`, {
                  method: "POST",
                  credentials: "include",
                  body: JSON.stringify({ ...user, ...vals, }),
                  headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                });

                if (!data) return;

                setUser({ ...data });

                if (data.status === "Success") {
                  navigation.navigate("Home");
                }
              }
              catch (err) {
                console.error("DeleteGroupScreen.jsx error", err.message);
              }
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
