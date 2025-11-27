import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { codeVerificationSchema } from "../validationSchema";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CodeVerificationScreen({ navigation, route }) {
  // const inviteToken = window.location.pathname
  //   .toLowerCase()
  //   .includes("groups/invite")
  //   ? window.location.pathname.split("/groups/invite/")[1].split("/")[0] // Extract the token part only
  //   : null;
  const inviteToken =
    Platform.OS == "web" &&
    window.location.pathname.toLowerCase().includes("groups/invite")
      ? window.location.pathname.split("/groups/invite/")[1].split("/")[0] // Extract the token part only
      : null;
  const { setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [verificationData, setVerificationData] = React.useState(null);
  const [codeResent, setCodeResent] = React.useState(0); // State to track code resends
  const { formVals } = route.params || {};

  React.useEffect(() => {
    const generateSignUpCode = async () => {
      try {
        const email = formVals.email;
        const response = await fetch(
          "http://localhost:8080/settings/generatesignupcode",
          //   "https://coral-app-n96bn.ondigitalocean.app/settings/generatesignupcode",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        if (!response.ok || response.status >= 400) {
          throw new Error("Failed to generate sign-up code. Please try again!");
        }

        const data = await response.json();

        // Set the hashedOTP in state
        setVerificationData(data.hashedOTP);
      } catch (error) {
        console.error("Error generating sign-up code:", error.message);
        setError("Failed to generate sign-up code");
      }
    };

    // Call the function when the component mounts
    generateSignUpCode();
  }, [formVals, codeResent]);

  const handlePress = () => {
    // Increment codeResent state to log how many times it's been resent
    setCodeResent((prevCount) => prevCount + 1);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Verification</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const isFieldEmpty = (values) => {
    return !values.passcode.trim();
  };

  return (
    <ScrollView
      style={{
        backgroundColor: "#fbfbfb",
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
          marginBottom: 70,
        }}
      >
        <Formik
          initialValues={{ passcode: "" }}
          validationSchema={codeVerificationSchema}
          onSubmit={async (values, actions) => {
            const userInputCode = values.passcode;
            const hashedOTP = verificationData;

            try {
              const response = await fetch(
                "http://localhost:8080/settings/validatesignup",
                // "https://coral-app-n96bn.ondigitalocean.app/settings/validatesignup",
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ userInputCode, hashedOTP }),
                }
              );

              if (!response.ok || response.status >= 400) {
                // Handle error
                console.error(
                  "Error validating sign-up code:",
                  response.status
                );
                // Show frontend error message
                setError("Invalid passcode. Please try again.");
                return;
              }

              // Successful validation, now sign up the user using the formVals obtained from SignUpScreen
              const responseData = await response.json();

              //  fetch("https://coral-app-n96bn.ondigitalocean.app/auth/signup", {
              // Check platform and determine which fetch request to make
              let url = "";
              if (Platform.OS === "web") {
                url = `http://localhost:8080/auth/signup`; // Web endpoint
              } else {
                url = `http://localhost:8080/auth/mobilesignup`; // Mobile endpoint

                //  url = `https://coral-app-n96bn.ondigitalocean.app/auth/mobilesignup`;
              }
              fetch(url, {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formVals),
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
                .then(async (data) => {
                  if (!data) return;
                  setUser({ ...data });
                  if (Platform.OS === "web") {
                    setUser({
                      loggedIn: true,
                    });
                    if (inviteToken) {
                      setUser({
                        ...user,
                        loggedIn: true,
                      });
                      navigation.navigate("HandleInvite", { inviteToken });
                    }
                  } else {
                    SecureStore.setItemAsync("token", data.token)
                      .then(() => {
                        return SecureStore.setItem(
                          "user",
                          JSON.stringify(data)
                        );
                      })
                      .then(() => {
                        setUser({
                          ...data,
                          loggedIn: true,
                        });
                        return AsyncStorage.setItem(
                          "isLoggedIn",
                          JSON.stringify(true)
                        );
                      })
                      .catch((err) => {
                        console.error("Error setting token or navigating", err);
                      });
                  }
                  // if (Platform.OS === "web") {
                  //   Cookies.set("token", data.token, {
                  //     expires: 365,
                  //     path: "/",
                  //     secure: true,
                  //     sameSite: "Strict",
                  //   });
                  //   localStorage.setItem("isLoggedIn", JSON.stringify(true));
                  // } else {
                  //   SecureStore.setItemAsync(
                  //     "token",
                  //     JSON.stringify(data.token)
                  //   );
                  //   SecureStore.setItem("user", JSON.stringify(data)); // storing the user in SecureStore
                  //   AsyncStorage.setItem("isLoggedIn", JSON.stringify(true)); // storing the iLoggedIn state in AsyncStorage
                  //   //  setUser({ ...data, loggedIn: true });
                  // }
                  // if (data.status) {
                  //   setError(data.status);
                  // }
                });

              // Reset form after successful validation
              //  actions.resetForm();
            } catch (error) {
              console.error("Error validating sign-up code:", error.message);
            }
          }}
        >
          {(props) => (
            <View style={{ marginHorizontal: 30 }}>
              <View>
                <Text style={globalStyles.headingText}>
                  Enter your Passcode
                </Text>
                <View style={[globalStyles.widthContainer, { marginTop: 16 }]}>
                  <Text style={globalStyles.bodyRegular}>
                    An email containing the verification code was sent to the
                    email address you provided.
                  </Text>
                  <View style={{ padding: 4 }}></View>
                  <Text style={globalStyles.bodyRegular}>
                    Please allow a few minutes for it to arrive. You may need to
                    check your Spam folder.
                  </Text>
                </View>
              </View>
              <View style={{ marginVertical: 10 }}></View>
              <Text style={globalStyles.textInputLabel}>
                Verification Code:
              </Text>
              <TextInput
                style={[globalStyles.passcodeInput, { padding: 10 }]}
                placeholder="Enter 6 digit code"
                onChangeText={props.handleChange("passcode")}
                value={props.values.passcode}
                marginBottom={10}
              />
              <Text style={globalStyles.captionError}>
                <ErrorMessage name="passcode" />
                {error && (
                  <Text style={globalStyles.captionError}>{error}</Text>
                )}
              </Text>
              <View>
                <View style={{ marginVertical: 10 }}></View>
                <View>
                  <TouchableOpacity
                    style={[
                      globalStyles.primaryButton,
                      {
                        backgroundColor: isFieldEmpty(props.values)
                          ? "#EBEBEB"
                          : globalStyles.primaryButton.backgroundColor,
                      },
                    ]}
                    accessibilityRole="button"
                    onPress={props.handleSubmit}
                    disabled={isFieldEmpty(props.values)}
                  >
                    <Text
                      style={[
                        globalStyles.primaryButtonText,
                        {
                          color: isFieldEmpty(props.values)
                            ? "#33333366"
                            : globalStyles.primaryButtonText.color,
                        },
                      ]}
                    >
                      {isFieldEmpty(props.values)
                        ? "Enter Code to Confirm"
                        : "Confirm"}
                    </Text>
                  </TouchableOpacity>
                  <View style={{ paddingVertical: 8 }}></View>
                  <TouchableOpacity
                    style={globalStyles.primaryButton}
                    accessibilityRole="button"
                    onPress={handlePress}
                  >
                    <Text style={globalStyles.primaryButtonText}>
                      Re-Send Verification Code
                    </Text>
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
