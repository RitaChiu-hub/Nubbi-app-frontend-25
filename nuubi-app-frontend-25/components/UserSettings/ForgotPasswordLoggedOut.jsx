import * as React from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
const { forgotPasswordSchema } = require("../validationSchema");
import { Formik, ErrorMessage } from "formik";
import * as SecureStore from "expo-secure-store";
import { useTogglePasswordVisibility } from "../useTogglePasswordVisibility";
import IconMC from "@expo/vector-icons/MaterialCommunityIcons";
import IconAD from "@expo/vector-icons/AntDesign";

export default function ForgotPasswordLoggedOut({ navigation }) {
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
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [enteredEmail, setEnteredEmail] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [comfirmPassword, setComfirmPassword] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const validatePassword = (input) => {
    let newSuggestions = [];
    if (input.length >= 8) {
      newSuggestions.push("L");
    }
    if (/\d/.test(input)) {
      newSuggestions.push("NM");
    }

    if (/[a-z]/.test(input)) {
      newSuggestions.push("LC");
    }

    if (/[A-Z]/.test(input)) {
      newSuggestions.push("UC");
    }

    if (/[^A-Za-z0-9]/.test(input)) {
      newSuggestions.push("SC");
    }

    setSuggestions(newSuggestions);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Reset Password</Text>
      ),
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
          flex: 1,
        }}
      >
        <View
          style={{
            paddingHorizontal: 0,
            paddingVertical: 0,
            paddingTop: 5,
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 0.2,
              backgroundColor: enteredEmail ? "#33FFB6" : "#fbfbfb",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                paddingVertical: 10,
                fontWeight: "500",
                color: enteredEmail ? "#006400" : "#050505",
              }}
            >
              {enteredEmail ? "Check Your Email" : "Enter Your Email"}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: enteredEmail ? "#006400" : "#333",
              }}
            >
              {enteredEmail
                ? "We've sent a passcode to your email. It may be in your spam folder."
                : "We will email you a passcode to reset or create your Nuubi password."}
            </Text>
            <View
              style={{ flex: 0.35, marginTop: 16, paddingHorizontal: 20 }}
            ></View>
            <Formik
              initialValues={{ email: "" }}
              onSubmit={(values, actions) => {
                const vals = { ...values };
                //  actions.resetForm();
                const email = vals.email;
                fetch(
                  "https://coral-app-n96bn.ondigitalocean.app/settings/generatepasscode",
                  {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...user, email }),
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
                    if (data.status) {
                      setError(data.status);
                    }
                  });
              }}
            >
              {(props) => (
                <View>
                  <Text style={globalStyles.textInputLabel}>Email:</Text>
                  <TextInput
                    style={globalStyles.textInput}
                    placeholder="School or Personal Email"
                    onChangeText={props.handleChange("email")}
                    value={props.values.email}
                  />
                  <View style={{ marginVertical: 5 }}></View>
                  <Text style={globalStyles.captionError}>{error}</Text>
                  <View style={{ marginVertical: 5 }}></View>
                  <View>
                    <TouchableOpacity
                      style={globalStyles.primaryButton}
                      accessibilityRole="button"
                      onPress={props.handleSubmit}
                    >
                      <Text style={globalStyles.primaryButtonText}>
                        Send passcode
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
            {/* </View> */}
            <View style={{ marginVertical: 16 }}></View>
            <Formik
              initialValues={{
                passcode: "",
                passattempt1: "",
                passattempt2: "",
              }}
              validationSchema={forgotPasswordSchema}
              onSubmit={(values, actions) => {
                const vals = { ...values };
                actions.resetForm();
                fetch(
                  "https://coral-app-n96bn.ondigitalocean.app/settings/forgotpassword",
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
                    setUser({ ...data });
                    if (data.status) {
                      setError(data.status);
                    }
                  });
              }}
            >
              {(props) => (
                <View>
                  <Text style={globalStyles.textInputLabel}>Passcode:</Text>
                  <TextInput
                    style={globalStyles.textInput}
                    placeholder="Enter 6 Digit Passcode"
                    onChangeText={props.handleChange("passcode")}
                    value={props.values.passcode}
                  />
                  <Text style={globalStyles.captionError}>
                    <ErrorMessage name="passcode" />
                  </Text>
                  <Text style={globalStyles.textInputLabel}>New Password:</Text>
                  {/* <TextInput
                    style={globalStyles.textInput}
                    placeholder="Enter New Password"
                    secureTextEntry={true}
                    onChangeText={props.handleChange("passattempt1")}
                    value={props.values.passattempt1}
                  /> */}
                  <View style={globalStyles.passwordInputContainer}>
                    <TextInput
                      style={[
                        globalStyles.passwordInput,
                        Platform.OS === "web" && {
                          outlineStyle: "none",
                        },
                      ]}
                      placeholder="Enter New Password"
                      onChangeText={(text) => {
                        setPassword(text);
                        props.setFieldValue("passattempt1", text);
                        validatePassword(text);
                      }}
                      value={password}
                      secureTextEntry={passwordVisibility}
                    />
                    <TouchableOpacity onPress={handlePasswordVisibility}>
                      <IconMC name={rightIcon} size={22} color="#2482AA" />
                    </TouchableOpacity>
                  </View>
                  <Text style={globalStyles.captionError}>
                    <ErrorMessage name="passattempt1" />
                  </Text>
                  <Text style={globalStyles.textInputLabel}>
                    Repeat New Password:
                  </Text>
                  {/* <TextInput
                    style={globalStyles.textInput}
                    placeholder="Repeat New Password"
                    secureTextEntry={true}
                    onChangeText={props.handleChange("passattempt2")}
                    value={props.values.passattempt2}
                  /> */}
                  <View style={globalStyles.passwordInputContainer}>
                    <TextInput
                      style={[
                        globalStyles.passwordInput,
                        Platform.OS === "web" && {
                          outlineStyle: "none",
                        },
                      ]}
                      placeholder="Repeat New Password"
                      onChangeText={(text) => {
                        setComfirmPassword(text);
                        props.setFieldValue("passattempt2", text);
                      }}
                      value={comfirmPassword}
                      secureTextEntry={passwordVisibility}
                    />
                    <TouchableOpacity onPress={handlePasswordVisibility}>
                      <IconMC name={rightIcon} size={22} color="#2482AA" />
                    </TouchableOpacity>
                  </View>
                  <Text style={globalStyles.captionError}>
                    <ErrorMessage name="passattempt2" />
                  </Text>
                  <View
                    style={{
                      padding: 10,
                      fontSize: 18,
                      width: "100%",
                      alignItems: "stretch",
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        color: "black",
                      }}
                    >
                      Password must contain:{" "}
                    </Text>
                    {[
                      { code: "L", label: "8 to 28 characters" },
                      { code: "LC", label: "At least one lowercase letter" },
                      { code: "UC", label: "At least one uppercase letter" },
                      { code: "NM", label: "At least one number" },
                      { code: "SC", label: "At least one special character" },
                    ].map((rule) => (
                      <Text
                        key={rule.code}
                        style={{
                          fontFamily: "Poppins_500Medium",
                          color: "black",
                        }}
                      >
                        <IconAD
                          name="checkcircle"
                          size={14}
                          color={
                            suggestions.includes(rule.code) &&
                            password.length > 0
                              ? "#00A86B"
                              : "#d8d8d8"
                          }
                        />{" "}
                        {rule.label}
                      </Text>
                    ))}
                  </View>

                  <View style={{ marginVertical: 5 }}></View>
                  <View>
                    <TouchableOpacity
                      style={globalStyles.primaryButton}
                      accessibilityRole="button"
                      onPress={props.handleSubmit}
                    >
                      <Text style={globalStyles.primaryButtonText}>
                        Reset password
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={globalStyles.linkButton}
                      onPress={() => {
                        if (inviteToken) {
                          // Navigate to ForgotPasswordLoggedOut with inviteToken
                          navigation.navigate("Login", { inviteToken });
                        } else {
                          // Regular navigation without inviteToken
                          navigation.navigate("Login");
                        }
                      }}
                    >
                      <Text style={globalStyles.captionLinkBlue}>
                        Return to Log In
                      </Text>
                    </TouchableOpacity>
                    <View style={{ marginVertical: 20 }}></View>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
