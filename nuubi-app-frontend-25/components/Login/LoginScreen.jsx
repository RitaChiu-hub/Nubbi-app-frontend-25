import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  ScrollView,
  Platform,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { loginStyles } from "../../styles/loginStyles";
const { formSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
import { useTogglePasswordVisibility } from "../useTogglePasswordVisibility";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import alert from "./../alert";
import { useAssets } from "expo-asset";

export default function LoginScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  let assets = useAssets([require("../../assets/google-logo.png")]);
  let assets2 = useAssets([require("../../assets/facebook-logo.png")]);

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const areAllFieldsEmpty = (values) => {
    return !values.username.trim() || !values.password.trim();
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={globalStyles.screenHeader}>Login</Text>,
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
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <Formik
          //  initialValues={{ username: "", password: "" }}
          initialValues={{ username: "Testuser", password: "Testpass!23" }}
          validationSchema={formSchema}
          onSubmit={(values, actions) => {
            values.username = values.username.trim();
            const vals = { ...values };
            actions.resetForm();
            //    fetch(`https://coral-app-n96bn.ondigitalocean.app/auth/login`, {
            fetch(`https://coral-app-n96bn.ondigitalocean.app/auth/login`, {
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
                  SecureStore.setItemAsync("token", JSON.stringify(data.token));
                }
                if (data.status) {
                  setError(data.status);
                }
              });
          }}
        >
          {(props) => (
            <View style={{ marginHorizontal: 30 }}>
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                }}
              >
                {error}
              </Text>
              <Text style={loginStyles.loginLabelText}>Email or Username:</Text>
              <TextInput
                style={styles.loginInput}
                placeholder="Email or Username"
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
              <Text style={loginStyles.loginLabelText}>Password:</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[
                    loginStyles.passwordInput,
                    Platform.OS === "web" && {
                      outlineStyle: "none",
                    },
                  ]}
                  placeholder="Password"
                  onChangeText={props.handleChange("password")}
                  value={props.values.password}
                  secureTextEntry={passwordVisibility}
                />
                <Pressable onPress={handlePasswordVisibility}>
                  <MaterialCommunityIcons
                    name={rightIcon}
                    size={22}
                    color="#2482AA"
                  />
                </Pressable>
              </View>
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                }}
              >
                <ErrorMessage name="password" />
              </Text>
              <View style={{ marginVertical: 16 }}></View>
              <View>
                <TouchableOpacity
                  style={[
                    loginStyles.loginButton,
                    {
                      backgroundColor: areAllFieldsEmpty(props.values)
                        ? "#EBEBEB"
                        : loginStyles.loginButton.backgroundColor,
                    },
                  ]}
                  accessibilityRole="button"
                  onPress={props.handleSubmit}
                  disabled={areAllFieldsEmpty(props.values)}
                >
                  <Text
                    style={[
                      loginStyles.loginButtonText,
                      {
                        color: areAllFieldsEmpty(props.values)
                          ? "#33333366"
                          : loginStyles.loginButtonText.color,
                      },
                    ]}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={loginStyles.secondaryButton}
                accessibilityRole="button"
                onPress={() => navigation.navigate("ForgotPasswordLoggedOut")}
              >
                <Text style={loginStyles.forgotPasswordText}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
              <View>
                <View style={{ marginTop: 10 }}>
                  <View style={loginStyles.dividerContainer}>
                    <View style={loginStyles.halfDivider}></View>
                    <Text style={loginStyles.orContinueWithText}>
                      or continue with
                    </Text>
                    <View style={loginStyles.halfDivider}></View>
                  </View>
                </View>

                <View style={loginStyles.ssoButtonsContainer}>
                  <TouchableOpacity
                    style={loginStyles.ssoButton}
                    accessibilityRole="button"
                    onPress={() => alert("Apple login coming soon!")}
                  >
                    <MaterialCommunityIcons
                      name="apple"
                      size={22}
                      color="black"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={loginStyles.ssoButton}
                    accessibilityRole="button"
                    onPress={() => alert("Google login coming soon!")}
                  >
                    <Image
                      style={{ width: 20, height: 20 }}
                      alt={"Google Logo"}
                      source={assets[0]}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={loginStyles.ssoButton}
                    accessibilityRole="button"
                    onPress={() => alert("Facebook login coming soon!")}
                  >
                    <Image
                      style={{ width: 22, height: 22 }}
                      alt={"Facebook Logo"}
                      source={assets2[0]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

const deviceWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  loginInput: {
    flex: 0.5,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#C0C0C0",
    backgroundColor: "#EBEBEB",
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#767676",
    padding: 12,
    borderRadius: 10,
    alignItems: "stretch",
    marginVertical: 5,
    width: deviceWidth * 0.9,
  },
  passwordInputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#C0C0C0",
    backgroundColor: "#EBEBEB",
    padding: 8,
    borderRadius: 10,
    width: deviceWidth * 0.9,
    alignItems: "stretch",
    marginVertical: 5,
  },
});
