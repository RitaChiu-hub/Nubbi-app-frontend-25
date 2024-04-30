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
import { signUpStyles } from "../../styles/signUpStyles";
import { codeVerificationSchema } from "../validationSchema";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

export default function CodeVerificationScreen({ navigation, route }) {
  const { setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [verificationData, setVerificationData] = React.useState(null);
  const { formVals } = route.params || {};

  React.useEffect(() => {
    const generateSignUpCode = async () => {
      try {
        const email = formVals.email;
        const response = await fetch(
          "https://coral-app-n96bn.ondigitalocean.app/settings/generatesignupcode",
          {
            // fetch("https://coral-app-n96bn.ondigitalocean.app/settings/generatesignupcode", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        if (!response.ok || response.status >= 400) {
          throw new Error("Failed to generate sign-up code");
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
  }, [formVals]);

  // Log the generated hashedOTP
  React.useEffect(() => {
    console.log("hashedOTP:", verificationData);
  }, [verificationData]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Verification</Text>
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
        backgroundColor: "#fdfdfd",
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
                "https://coral-app-n96bn.ondigitalocean.app/settings/validatesignup",
                {
                  //fetch("https://coral-app-n96bn.ondigitalocean.app/settings/validatesignup", {
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

              fetch("https://coral-app-n96bn.ondigitalocean.app/auth/signup", {
                //fetch("https://coral-app-n96bn.ondigitalocean.app/auth/signup", {
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
                .then((data) => {
                  if (!data) return;
                  setUser({ ...data, firstSignIn: true });
                  if (Platform.OS === "web") {
                    localStorage.setItem("token", data.token);
                  } else {
                    SecureStore.setItemAsync("token", data.token);
                  }
                  if (data.status) {
                    setError(data.status);
                  }
                });

              // Reset form after successful validation
              actions.resetForm();
            } catch (error) {
              console.error("Error validating sign-up code:", error.message);
            }
          }}
        >
          {(props) => (
            <View style={{ marginHorizontal: 30 }}>
              <View>
                <Text style={signUpStyles.headingText}>
                  Enter your Passcode
                </Text>
                <View style={{ marginVertical: 10 }}></View>
                <Text style={signUpStyles.acknowledgmentText}>
                  An email containing the verification code was sent to your
                  email address.
                </Text>
              </View>
              <View style={{ marginVertical: 10 }}></View>
              <Text style={signUpStyles.loginLabelText}>
                Verification Code:
              </Text>
              <TextInput
                style={[signUpStyles.passcodeInput, { padding: 10 }]}
                placeholder="Enter 6 digit code"
                onChangeText={props.handleChange("passcode")}
                value={props.values.passcode}
                marginBottom={10}
              />
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                }}
              >
                <ErrorMessage name="passcode" />
                {error && <Text style={{ color: "red" }}>{error}</Text>}
              </Text>
              <View>
                <View style={{ marginVertical: 10 }}></View>
                <View>
                  <TouchableOpacity
                    style={[
                      signUpStyles.confirmButton,
                      {
                        backgroundColor: isFieldEmpty(props.values)
                          ? "#EBEBEB"
                          : signUpStyles.signUpButton.backgroundColor,
                      },
                    ]}
                    accessibilityRole="button"
                    onPress={props.handleSubmit}
                    disabled={isFieldEmpty(props.values)}
                  >
                    <Text
                      style={[
                        signUpStyles.signUpButtonText,
                        {
                          color: isFieldEmpty(props.values)
                            ? "#33333366"
                            : signUpStyles.signUpButtonText.color,
                        },
                      ]}
                    >
                      Confirm
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
