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
          // initialValues={{ username: "", password: "" }}
          initialValues={{ username: "Testuser", password: "Testpass!23" }}
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
            actions.resetForm();
            console.log("going to do the auth/login now");

            fetch(`http://localhost:8080/auth/login`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(vals),
            })
              .then((res) => {
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
              .then(async (data) => {
                // Handle successful login
                if (!data) return;
                setUser({ ...data });

                if (Platform.OS === "web") {
                  console.log("web cookie in backend http only");
                  setUser({
                    loggedIn: true,
                    token: (
                      document.cookie
                        .split("; ")
                        .find((row) => row.startsWith("token=")) || ""
                    ).split("=")[1],
                  });
                  console.log(
                    "cookie????? " +
                      document.cookie
                        .split("; ")
                        .find((row) => row.startsWith("token="))
                  );
                  console.log(
                    "User data from login page: " +
                      JSON.stringify(user, null, 2)
                  );
                } else {
                  SecureStore.setItemAsync("token", JSON.stringify(data.token));
                  SecureStore.setItem("user", JSON.stringify(data)); // storing the user in SecureStore
                  AsyncStorage.setItem("isLoggedIn", JSON.stringify(true)); // storing the iLoggedIn state in AsyncStorage
                }
              })
              .catch((err) => {
                console.error(err); // Handle error logging if necessary
              });
          }}
        >
          {/* //   onSubmit={(values, actions) => { */}
          {/* //     values.username = values.username.trim();
        //     const vals = { ...values };
        //     actions.resetForm();
        //     console.log("going to do the auth/login now");
        //     //    fetch(`http://localhost:8080/auth/login`, { */}
          {/* //     fetch(`http://localhost:8080/auth/login`, {
        //       method: "POST",
        //       credentials: "include",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify(vals),
        //     })
        //       .catch((err) => {
        //         return;
        //       })
        //       .then((res) => {
        //         if (!res || !res.ok || res.status >= 400) {
        //           return;
        //         }
        //         return res.json();
        //       })
        //       .then(async (data) => {
        //         if (!data) return;
        //         setUser({ ...data });

        //         if (Platform.OS === "web") {
        //           console.log("web cookie in backend http only");
        //           setUser({
        //             loggedIn: true,
        //             token: (
        //               document.cookie
        //                 .split("; ")
        //                 .find((row) => row.startsWith("token=")) || ""
        //             ).split("=")[1],
        //           });
        //           console.log(
        //             "cookie????? " +
        //               document.cookie
        //                 .split("; ")
        //                 .find((row) => row.startsWith("token="))
        //           );
        //           console.log(
        //             "User data from login page: " +
        //               JSON.stringify(user, null, 2)
        //           );
        //         } else {
        //           SecureStore.setItemAsync("token", JSON.stringify(data.token));
        //           SecureStore.setItem("user", JSON.stringify(data)); // storing the user in SecureStore
        //           AsyncStorage.setItem("isLoggedIn", JSON.stringify(true)); // storing the iLoggedIn state in AsyncStorage
        //           //  setUser({ ...data, loggedIn: true });
        //         }
        //         if (data.status) {
        //           setError(data.status);
        //         }
        //       });
        //   }}
        // > */}
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
                onPress={() => navigation.navigate("ForgotPasswordLoggedOut")}
              >
                <Text style={globalStyles.captionLinkBlue}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
              <View>
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

                  <TouchableOpacity
                    style={globalStyles.ssoButton}
                    accessibilityRole="button"
                    onPress={() => alert("Facebook login coming soon!")}
                  >
                    <Image
                      style={{ width: 22, height: 22 }}
                      alt={"Facebook Logo"}
                      source={
                        Platform.OS == "web"
                          ? require("../../assets/facebook-logo.png")
                          : assets2[0]
                      }
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
