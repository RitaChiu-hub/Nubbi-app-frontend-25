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
  Alert,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { formSignupSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
import IconMC from "react-native-vector-icons/MaterialCommunityIcons";
import { signUpStyles } from "../../styles/signUpStyles";
import { useTogglePasswordVisibility } from "../useTogglePasswordVisibility";
import IconAD from "react-native-vector-icons/AntDesign";
import alert from './../alert'

export default function SignUpScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [suggestions, setSuggestions] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [comfirmPassword, setComfirmPassword] = React.useState("");
  const [showComfirmPWDStatus, setShowComfirmPWDStatus] = React.useState("");
  const [comfirmPasswardStatus, setComfirmPasswardStatus] = React.useState("");

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

  const validatePassword = (input) => {
    let newSuggestions = [];
    if (input.length > 8) {
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
    if(password === comfirmPassword && comfirmPassword.length > 0){
      setComfirmPasswardStatus('true');
      setShowComfirmPWDStatus('true'); // The 'true' is to help show the password match text below the comfirm password input
    }else if(password != comfirmPassword && comfirmPassword.length > 0){
      setComfirmPasswardStatus('false');
      setShowComfirmPWDStatus('yes'); //the 'yes' is to help show the password mismach text below the comfirm password input

    }
  }, [comfirmPassword])

  React.useEffect(() => {
    if (showComfirmPWDStatus == 'true' && comfirmPasswardStatus == 'true') {
      // 1000 for 1 second
      setTimeout(() => setShowComfirmPWDStatus('false'), 2000) //the 'false' is to help hide the password match/mismach text below the comfirm password input
    }
  }, [showComfirmPWDStatus])

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={globalStyles.screenHeader}>Sign Up</Text>,
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
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
          marginBottom: 70,
        }}
      >
        <Formik
          initialValues={{
            email: "",
            //  password: "",
            password: password,
            password2: comfirmPassword,
         //   password2: "",
          }}
          validationSchema={formSignupSchema}
          onSubmit={(values, actions) => {
            values.email = values.email.trim();
            values.password = password;
            values.password2 = comfirmPassword;
            //    const vals = { ...values };
            const vals = {
              email: values.email,
              password: password,
              password2: comfirmPassword,
            //  password2: values.password2,
              // password2: comfirmPassword,
            };
            // console.log({ ...vals });
            // console.log({ ...values });
            // console.log(areAllFieldsEmpty(values));

            actions.resetForm();
            fetch("http://localhost:8080/auth/checkemail", {
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
                if (data.status) {
                  setError(data.status);
                } else {
                  navigation.navigate("CodeVerificationScreen", {
                    formVals: vals,
                  });
                }
                if (!data) return;
                setUser({ ...data });
              });
          }}
        >
          {(props) => (
            <View>
              <View style={{ marginHorizontal: 30 }}>
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  {error}
                </Text>
                <Text style={signUpStyles.loginLabelText}>Email:</Text>
                <TextInput
                  style={signUpStyles.loginInput}
                  placeholder="School or Personal Email"
                  onChangeText={props.handleChange("email")}
                  value={props.values.email}
                />
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="email" />
                </Text>
                <Text style={signUpStyles.loginLabelText}>Password:</Text>
                <View style={signUpStyles.passwordInputContainer}>
                  <TextInput
                    style={[
                      signUpStyles.passwordInput,
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
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="password" />
                </Text>
                <Text style={signUpStyles.loginLabelText}>Repeat Password:</Text>
                <View style={signUpStyles.passwordInputContainer}>
                  <TextInput
                    style={[
                      signUpStyles.passwordInput,
                      Platform.OS === "web" && {
                        outlineStyle: "none",
                      },
                    ]}
                    placeholder="Confirm Password"
                 //   onChangeText={props.handleChange("password2")}
                 //   value={props.values.password2}
                 onChangeText={(passwordText2)=> {setComfirmPassword(passwordText2)}}
                 value={comfirmPassword}
                    secureTextEntry={passwordVisibility}
                  />
                  <Pressable onPress={handlePasswordVisibility}>
                    <IconMC name={rightIcon} size={22} color="#2482AA" />
                  </Pressable>
                </View>

                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="password2" />
                </Text>
                {(showComfirmPWDStatus == 'yes' || showComfirmPWDStatus == 'true') && <View>
                    {comfirmPasswardStatus === 'true' ? <Text style={{color:'green'}}>*Passwords match</Text>: <Text style={{color:'red'}}>*Passwords do not match</Text>}
                </View>}


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
                        signUpStyles.signUpButton,
                        {
                          backgroundColor: areAllFieldsEmpty(props.values)
                            ? "#EBEBEB"
                            : signUpStyles.signUpButton.backgroundColor,
                        },
                      ]}
                      accessibilityRole="button"
                      onPress={props.handleSubmit}
                    disabled={areAllFieldsEmpty(props.values)}
                    >
                      <Text
                        style={[
                          signUpStyles.signUpButtonText,
                          {
                            color: areAllFieldsEmpty(props.values)
                              ? "#33333366"
                              : signUpStyles.signUpButtonText.color,
                          },
                        ]}
                      >
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ marginTop: 16 }}>
                  <Text style={signUpStyles.acknowledgmentText}>
                    By signing up, I agree to NUUBI’s{" "}
                    <Text
                      style={globalStyles.captionLinkBlue}
                      onPress={() => {
                        navigation.navigate("TermsScreen");
                      }}
                    >
                      Terms of Service
                    </Text>{" "}
                    and{" "}
                    <Text
                      style={globalStyles.captionLinkBlue}
                      onPress={() => {
                        navigation.navigate("PrivacyScreen");
                      }}
                    >
                      Privacy Policy
                    </Text>
                    .
                  </Text>

                  <View style={signUpStyles.dividerContainer}>
                    <View style={signUpStyles.halfDivider}></View>
                    <Text style={signUpStyles.orContinueWithText}>
                      or continue with
                    </Text>
                    <View style={signUpStyles.halfDivider}></View>
                  </View>
                </View>

                <View style={signUpStyles.ssoButtonsContainer}>
                  <TouchableOpacity
                    style={signUpStyles.ssoButton}
                    accessibilityRole="button"
                    onPress={() => alert("Apple login coming soon!")}
                  >
                    <IconMC name="apple" size={22} color="black" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={signUpStyles.ssoButton}
                    accessibilityRole="button"
                    onPress={() => alert("Google login coming soon!")}
                  >
                    <Image
                      style={{ width: 20, height: 20 }}
                      alt={"Google Logo"}
                      source={require("../../assets/google-logo.png")}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={signUpStyles.ssoButton}
                    accessibilityRole="button"
                    onPress={() => alert("Facebook login coming soon!")}
                  >
                    <Image
                      style={{ width: 22, height: 22 }}
                      alt={"Facebook Logo"}
                      source={require("../../assets/facebook-logo.png")}
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
