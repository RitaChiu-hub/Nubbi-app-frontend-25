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
  KeyboardAvoidingView,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { formSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
import { useTogglePasswordVisibility } from "../useTogglePasswordVisibility";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import alert from "./../alert";
import { useAssets } from "expo-asset";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const inviteToken =
    Platform.OS == "web" &&
    window.location.pathname.toLowerCase().includes("groups/invite")
      ? window.location.pathname.split("/groups/invite/")[1].split("/")[0] // Extract the token part only
      : null;
  // const inviteToken = window.location.pathname
  //   .toLowerCase()
  //   .includes("groups/invite")
  //   ? window.location.pathname.split("/groups/invite/")[1].split("/")[0] // Extract the token part only
  //   : null;

  let assets = useAssets([require("../../assets/google-logo.png")]);
  let assets2 = useAssets([require("../../assets/facebook-logo.png")]);

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const areAllFieldsEmpty = (values) => {
    return !values.username.trim() || !values.password.trim();
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={globalStyles.h3HeadingWhite}>Login</Text>,
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust if your header takes space
    >
      <ScrollView
        style={{
          backgroundColor: "#fbfbfb",
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
            initialValues={{ username: "", password: "" }}
            // initialValues={{ username: "Testuser", password: "Testpass!23" }}
            // initialValues={{
            //   username: "TestInstructor",
            //   password: "TestNuubi!23",
            // }}
            // initialValues={{
            //   username: "TestStudent",
            //   password: "!2MemberTest",
            // }}
            validationSchema={formSchema}
            onSubmit={(values, actions) => {
              values.username = values.username.trim();
              const vals = { ...values };
              // actions.resetForm();

              // Check platform and determine which fetch request to make
              let url = "";
              if (Platform.OS === "web") {
                url = `https://coral-app-n96bn.ondigitalocean.app/auth/login`; // Web endpoint
              } else {
                url = `https://coral-app-n96bn.ondigitalocean.app/auth/mobilelogin`; // Mobile endpoint
              }

              fetch(url, {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(vals),
              })
                .then(async (res) => {
                  // Check for HTTP errors
                  if (!res.ok) {
                    return res.json().then((data) => {
                      // Handle error messages here
                      if (data.message) {
                        setError(data.message); // Set error message from the server
                      } else {
                        setError("An unknown error occurred"); // Fallback error message
                      }
                      throw new Error(data.message || "Error"); // Throw error to skip the next .then
                    });
                  }
                  return res.json();
                })
                .then((data) => {
                  // Handle successful login
                  if (!data) return;
                  setUser({ ...data });
                  if (Platform.OS === "web") {
                    const mytoken = data.token;
                    setUser({
                      ...user,
                      loggedIn: true,
                      token: mytoken,
                    });
                    sessionStorage.setItem("token", mytoken);

                    if (inviteToken) {
                      setUser({
                        ...user,
                        loggedIn: true,
                        token: mytoken,
                      });
                      sessionStorage.setItem("token", mytoken);
                      navigation.navigate("HandleInvite", { inviteToken });
                    }
                  } else {
                    SecureStore.setItemAsync("token", data.token)
                      .then(() => {
                        return SecureStore.setItem(
                          "user",
                          JSON.stringify(data)
                        ); // storing the user in SecureStore
                      })
                      .then(() => {
                        setUser({ ...data, loggedIn: true });
                        return AsyncStorage.setItem(
                          "isLoggedIn",
                          JSON.stringify(true)
                        );
                      })
                      .catch((err) => {
                        console.error("Error setting token or navigating", err);
                      });
                  }
                });
            }}
          >
            {(props) => (
              <View style={{ marginHorizontal: 30 }}>
                <Text style={globalStyles.captionError}>{error}</Text>
                <Text style={globalStyles.textInputLabel}>
                  Email or Username:
                </Text>
                <TextInput
                  style={globalStyles.textInput}
                  placeholder="Email or Username"
                  onChangeText={props.handleChange("username")}
                  value={props.values.username}
                />
                <Text style={globalStyles.captionError}>
                  <ErrorMessage name="username" />
                </Text>
                <Text style={globalStyles.textInputLabel}>Password:</Text>
                <View style={globalStyles.passwordInputContainer}>
                  <TextInput
                    style={[
                      globalStyles.passwordInput,
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
                <Text style={globalStyles.captionError}>
                  <ErrorMessage name="password" />
                </Text>
                <View style={{ marginVertical: 8 }}></View>
                <View>
                  <TouchableOpacity
                    style={[
                      globalStyles.primaryButton,
                      {
                        backgroundColor: areAllFieldsEmpty(props.values)
                          ? "#EBEBEB"
                          : globalStyles.primaryButton.backgroundColor,
                      },
                    ]}
                    accessibilityRole="button"
                    onPress={props.handleSubmit}
                    disabled={areAllFieldsEmpty(props.values)}
                  >
                    <Text
                      style={[
                        globalStyles.primaryButtonText,
                        {
                          color: areAllFieldsEmpty(props.values)
                            ? "#33333366"
                            : globalStyles.primaryButtonText.color,
                        },
                      ]}
                    >
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={globalStyles.linkButton}
                  accessibilityRole="button"
                  onPress={() => {
                    if (inviteToken) {
                      // Navigate to ForgotPasswordLoggedOut with inviteToken
                      navigation.navigate("ForgotPasswordLoggedOut", {
                        inviteToken,
                      });
                    } else {
                      // Regular navigation without inviteToken
                      navigation.navigate("ForgotPasswordLoggedOut");
                    }
                  }}
                >
                  <Text style={globalStyles.captionLinkBlue}>
                    Forgot or need to create password?
                  </Text>
                </TouchableOpacity>

                <View style={globalStyles.dividerContainer}>
                  <View style={globalStyles.halfDivider}></View>
                  <Text style={globalStyles.bodyRegular}>
                    {"  "}
                    Don't have an account?
                  </Text>
                  <TouchableOpacity
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      //   backgroundColor: "red",
                    }}
                    accessibilityRole="button"
                    onPress={() => {
                      if (inviteToken) {
                        // Navigate to ForgotPasswordLoggedOut with inviteToken
                        navigation.navigate("SignUp", { inviteToken });
                      } else {
                        // Regular navigation without inviteToken
                        navigation.navigate("SignUp");
                      }
                    }}
                  >
                    <Text style={globalStyles.captionLinkBlue}>
                      {/* //   color: "#050505",
                        //   fontFamily: "Poppins_500Medium",
                        //   fontSize: 14,
                        //   letterSpacing: 0.4,
                        //   textDecorationLine: "underline", */}
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                  <View style={globalStyles.halfDivider}></View>
                </View>

                {/* <View>
                <View style={{ marginTop: 10 }}>
                  <View style={globalStyles.dividerContainer}>
                    <View style={globalStyles.halfDivider}></View>
                    <Text style={globalStyles.bodyRegular}>
                      {" "}
                      or continue with{" "}
                    </Text>
                    <View style={globalStyles.halfDivider}></View>
                  </View>
                </View>

                <View style={globalStyles.ssoButtonsContainer}>
                  <TouchableOpacity
                    style={globalStyles.ssoButton}
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
                    style={globalStyles.ssoButton}
                    accessibilityRole="button"
                    onPress={() => alert("Google login coming soon!")}
                  >
                    <Image
                      style={{ width: 20, height: 20 }}
                      alt={"Google Logo"}
                      source={
                        Platform.OS == "web"
                          ? require("../../assets/google-logo.png")
                          : assets[0]
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View> */}
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
