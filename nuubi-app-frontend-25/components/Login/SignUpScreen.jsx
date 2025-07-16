import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Pressable,
  Image,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { formSignupSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import IconMC from "@expo/vector-icons/MaterialCommunityIcons";
import { useTogglePasswordVisibility } from "../useTogglePasswordVisibility";
import IconAD from "@expo/vector-icons/AntDesign";
import alert from "./../alert";
import { useAssets } from "expo-asset";

export default function SignUpScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [suggestions, setSuggestions] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState(""); //take this out after testing
  const [comfirmPassword, setComfirmPassword] = React.useState(""); //take this out after testing
  const [showComfirmPWDStatus, setShowComfirmPWDStatus] = React.useState("");
  const [comfirmPasswardStatus, setComfirmPasswardStatus] = React.useState("");
  let assets = useAssets([require("../../assets/google-logo.png")]);
  let assets2 = useAssets([require("../../assets/facebook-logo.png")]);
  const deviceWidth = Dimensions.get("window").width;

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const areAllFieldsEmpty = (values) => {
    values.email = values.email.trim();
    values.password = password;
    values.password2 = comfirmPassword;
    return (
      !values.email.trim() ||
      !values.password.trim() ||
      !values.password2.trim()
    );
  };

  const inviteToken =
    Platform.OS == "web" &&
    window.location.pathname.toLowerCase().includes("groups/invite")
      ? window.location.pathname.split("/groups/invite/")[1].split("/")[0] // Extract the token part only
      : null;
  // const inviteToken = window.location.pathname
  // .toLowerCase()
  // .includes("groups/invite")
  // ? window.location.pathname.split("/groups/invite/")[1].split("/")[0] // Extract the token part only
  // : null;

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

  React.useEffect(() => {
    if (password === comfirmPassword && comfirmPassword.length > 0) {
      setComfirmPasswardStatus("true");
      setShowComfirmPWDStatus("true"); // The 'true' is to help show the password match text below the comfirm password input
    } else if (password != comfirmPassword && comfirmPassword.length > 0) {
      setComfirmPasswardStatus("false");
      setShowComfirmPWDStatus("yes"); //the 'yes' is to help show the password mismach text below the comfirm password input
    }
  }, [comfirmPassword]);

  React.useEffect(() => {
    if (showComfirmPWDStatus == "true" && comfirmPasswardStatus == "true") {
      // 1000 for 1 second
      setTimeout(() => setShowComfirmPWDStatus("false"), 2000); //the 'false' is to help hide the password match/mismach text below the comfirm password input
    }
  }, [showComfirmPWDStatus]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Sign Up</Text>
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
          maxWidth: deviceWidth,
          paddingBottom: 140,
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
            initialValues={{
              //email: email,
              email: user?.email || "",
              password: "",
              password2: "",
              //  password: password,
              //   password2: comfirmPassword,
            }}
            //  enableReinitialize={true}
            validationSchema={formSignupSchema}
            onSubmit={(values, actions) => {
              values.email = values.email.trim();
              values.password = password;
              values.password2 = comfirmPassword;
              const vals = {
                email: values.email,
                password: password,
                password2: comfirmPassword,
              };
              actions.resetForm();
              fetch(
                "https://coral-app-n96bn.ondigitalocean.app/auth/checkemail",
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(vals),
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
                  if (data.status) {
                    setError(data.status);
                  } else {
                    navigation.navigate("CodeVerificationScreen", {
                      formVals: vals,
                      ...(inviteToken ? { inviteToken } : {}),
                    });
                    // navigation.navigate("CodeVerificationScreen", {
                    //   formVals: vals,
                    // });
                  }
                  if (!data) return;
                  setUser({ ...data });
                  // Reset the form after submission
                  actions.resetForm({
                    values: {
                      email: "", // Ensure email is blank for new users
                      password: "",
                      password2: "",
                    },
                  });
                  setPassword("");
                  setComfirmPassword("");
                  setSuggestions([]);
                  setShowComfirmPWDStatus("");
                  setComfirmPasswardStatus("");
                });
            }}
          >
            {(props) => (
              <View style={{ marginHorizontal: 30 }}>
                {error != null && (
                  <View
                    style={[globalStyles.widthContainer, { marginTop: 16 }]}
                  >
                    <View
                      style={{
                        maxWidth: "100%",
                        alignSelf: "center",
                        flexWrap: "wrap",
                        paddingTop: 16,
                        paddingBottom: 6,
                      }}
                      accessibilityRole="none"
                    >
                      <Text style={[globalStyles.captionError]}>
                        Oops! {error} Would you like to:{" "}
                        <TouchableOpacity
                          //    onPress={() => navigation.navigate("Login")}
                          onPress={() => {
                            if (inviteToken) {
                              // Navigate to ForgotPasswordLoggedOut with inviteToken
                              navigation.navigate("Login", { inviteToken });
                            } else {
                              // Regular navigation without inviteToken
                              navigation.navigate("Login");
                            }
                          }}
                          accessibilityRole="button"
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Larger clickable area
                        >
                          <Text
                            style={{
                              color: "#050505",
                              fontFamily: "Poppins_500Medium",
                              fontSize: 14,
                              letterSpacing: 0.4,
                              textDecorationLine: "underline",
                            }}
                          >
                            {" "}
                            Log In
                          </Text>
                        </TouchableOpacity>{" "}
                        or{" "}
                        <TouchableOpacity
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
                          accessibilityRole="button"
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Larger clickable area
                        >
                          <Text
                            style={{
                              color: "#050505",
                              fontFamily: "Poppins_500Medium",
                              fontSize: 14,
                              letterSpacing: 0.4,
                              textDecorationLine: "underline",
                            }}
                          >
                            {" "}
                            Forgot or need to create password?
                          </Text>
                        </TouchableOpacity>
                      </Text>
                    </View>
                  </View>
                )}

                <Text style={globalStyles.textInputLabel}>Email:</Text>
                <TextInput
                  style={globalStyles.textInput}
                  placeholder="School or Personal Email"
                  onChangeText={props.handleChange("email")}
                  value={props.values.email}
                />
                <Text style={globalStyles.captionError}>
                  <ErrorMessage name="email" />
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
                    // onChangeText={props.handleChange("password")}
                    onChangeText={(passwordText) => {
                      setPassword(passwordText), validatePassword(passwordText);
                    }}
                    //   value={props.values.password}
                    value={password}
                    secureTextEntry={passwordVisibility}
                  />
                  <Pressable onPress={handlePasswordVisibility}>
                    <IconMC name={rightIcon} size={22} color="#2482AA" />
                  </Pressable>
                </View>
                <Text style={globalStyles.captionError}>
                  <ErrorMessage name="password" />
                </Text>
                <Text style={globalStyles.textInputLabel}>
                  Repeat Password:
                </Text>
                <View style={globalStyles.passwordInputContainer}>
                  <TextInput
                    style={[
                      globalStyles.passwordInput,
                      Platform.OS === "web" && {
                        outlineStyle: "none",
                      },
                    ]}
                    placeholder="Confirm Password"
                    //   onChangeText={props.handleChange("password2")}
                    //   value={props.values.password2}
                    onChangeText={(passwordText2) => {
                      setComfirmPassword(passwordText2);
                    }}
                    value={comfirmPassword}
                    secureTextEntry={passwordVisibility}
                  />
                  <Pressable onPress={handlePasswordVisibility}>
                    <IconMC name={rightIcon} size={22} color="#2482AA" />
                  </Pressable>
                </View>

                <Text style={globalStyles.captionError}>
                  <ErrorMessage name="password2" />
                </Text>
                {(showComfirmPWDStatus == "yes" ||
                  showComfirmPWDStatus == "true") && (
                  <View>
                    {comfirmPasswardStatus === "true" ? (
                      <Text style={globalStyles.captionErrorSuccess}>
                        *Passwords match
                      </Text>
                    ) : (
                      <Text style={globalStyles.captionError}>
                        *Passwords do not match
                      </Text>
                    )}
                  </View>
                )}

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
                    style={{ fontFamily: "Poppins_500Medium", color: "black" }}
                  >
                    Password must contain:{" "}
                  </Text>
                  {suggestions.includes("L") && password.length > 0 ? (
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        color: "black",
                      }}
                    >
                      <IconAD name="checkcircle" size={14} color="#00A86B" /> 8
                      to 28 characters
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        color: "black",
                      }}
                    >
                      <IconAD name="checkcircle" size={14} color="#d8d8d8" /> 8
                      to 28 characters
                    </Text>
                  )}
                  {suggestions.includes("LC") && password.length > 0 ? (
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        color: "black",
                      }}
                    >
                      <IconAD name="checkcircle" size={14} color="#00A86B" /> At
                      least one lowercase letter
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        color: "black",
                      }}
                    >
                      <IconAD name="checkcircle" size={14} color="#d8d8d8" /> At
                      least one lowercase letter
                    </Text>
                  )}
                  {suggestions.includes("UC") && password.length > 0 ? (
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        color: "black",
                      }}
                    >
                      <IconAD name="checkcircle" size={14} color="#00A86B" /> At
                      least one uppercase letter
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        color: "black",
                      }}
                    >
                      <IconAD name="checkcircle" size={14} color="#d8d8d8" /> At
                      least one uppercase letter
                    </Text>
                  )}
                  {suggestions.includes("NM") && password.length > 0 ? (
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        color: "black",
                      }}
                    >
                      <IconAD name="checkcircle" size={14} color="#00A86B" /> At
                      least one number
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        color: "black",
                      }}
                    >
                      <IconAD name="checkcircle" size={14} color="#d8d8d8" /> At
                      least one number
                    </Text>
                  )}
                  {suggestions.includes("SC") && password.length > 0 ? (
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        color: "black",
                      }}
                    >
                      <IconAD name="checkcircle" size={14} color="#00A86B" /> At
                      least one special character
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        color: "black",
                      }}
                    >
                      <IconAD name="checkcircle" size={14} color="#d8d8d8" /> At
                      least one special character
                    </Text>
                  )}
                </View>
                <View style={{ marginVertical: 5 }}></View>
                <View>
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
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[globalStyles.widthContainer, { marginTop: 16 }]}>
                  <View
                    style={[globalStyles.widthContainer, { marginTop: 16 }]}
                  >
                    <Text style={globalStyles.bodyRegular}>
                      By signing up, I agree to Nuubi’s{" "}
                      <TouchableOpacity
                        onPress={() => navigation.navigate("TermsScreen")}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Larger clickable area
                      >
                        <Text style={globalStyles.captionLinkBlue}>
                          Terms of Service
                        </Text>
                      </TouchableOpacity>{" "}
                      and{" "}
                      <TouchableOpacity
                        onPress={() => navigation.navigate("PrivacyScreen")}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Larger clickable area
                      >
                        <Text style={globalStyles.captionLinkBlue}>
                          Privacy Policy
                        </Text>
                      </TouchableOpacity>
                      .
                    </Text>

                    <View style={globalStyles.dividerContainer}>
                      <View style={globalStyles.halfDivider}></View>
                      <Text style={globalStyles.bodyRegular}>
                        {"  "}
                        Already have an account?
                      </Text>
                      <TouchableOpacity
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 10,
                          //   backgroundColor: "red",
                        }}
                        accessibilityRole="button"
                        // onPress={() =>
                        //   navigation.navigate("Login", { inviteToken })
                        // }
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
                        <Text style={globalStyles.captionLinkBlue}>Log In</Text>
                      </TouchableOpacity>
                      <View style={globalStyles.halfDivider}></View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
