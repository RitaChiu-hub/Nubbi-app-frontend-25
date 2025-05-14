import { ErrorMessage, Formik } from "formik";
import * as React from "react";
import { useRef, useState } from "react"; // Import useState and useRef
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import IconAD from "@expo/vector-icons/AntDesign";
import IconMC from "@expo/vector-icons/MaterialCommunityIcons";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import { useTogglePasswordVisibility } from "../useTogglePasswordVisibility";
const { formSchema, newPasswordSchema } = require("../validationSchema");
import * as SecureStore from "expo-secure-store";

export default function ChangePasswordScreen({ navigation }) {
  const { goBack, navigate } = navigation;
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [password1, setPassword1] = React.useState("");
  const [scrollHeight, setScrollHeight] = useState(0);
  const scrollViewRef = useRef(null);
  const [adjustHeight, setAdjustHeight] = useState(true);
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();
  const [initialLayoutHeight, setInitialLayoutHeight] = useState(0);
  const [initialScrollHeight, setInitialScrollHeight] = useState(0);

  // Tried method call, first View height: ScreenHeight || height
  // const ScreenHeight = Dimensions.get("window").height - 170;
  // const { height, width } = useWindowDimensions();

  // onlayout setting device height on first event..
  const [layoutHeight, setLayoutHeight] = React.useState(0);
  const [suggestions, setSuggestions] = React.useState([]);

  //I didn't want it to look empty so I added noSC as a condition
  const validatePassword = (input) => {
    let newSuggestions = [];
    if (input.length >= 8) {
      newSuggestions.push("L");
    }
    if (input.length < 29) {
      newSuggestions.push("H");
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
        <Text style={globalStyles.h3HeadingWhite}>Update Password</Text>
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
        style={{ backgroundColor: "#fbfbfb" }}
        onLayout={(event) => {
          if (initialLayoutHeight === 0) {
            setInitialLayoutHeight(event.nativeEvent.layout.height);
          }
          setLayoutHeight(event.nativeEvent.layout.height);
        }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={globalStyles.widthContainer}>
            <Formik
              initialValues={{
                password: "",
                passattempt1: "",
                passattempt2: "",
              }}
              validationSchema={newPasswordSchema}
              onSubmit={async (values, actions) => {
                const vals = { ...values };
                actions.resetForm();
                const token =
                  Platform.OS !== "web"
                    ? await SecureStore.getItemAsync("token")
                    : null; // Get token only on mobile

                fetch(
                  "https://coral-app-n96bn.ondigitalocean.app/settings/updatepassword",
                  {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={[globalStyles.textInputLabel, { marginTop: 24 }]}
                  >
                    Enter your old password
                  </Text>
                  <Text style={globalStyles.captionError}>{error}</Text>
                  <TextInput
                    style={globalStyles.textInput}
                    placeholder="Enter your old password"
                    secureTextEntry={true}
                    onChangeText={props.handleChange("password")}
                    value={props.values.password}
                  />
                  <Text style={globalStyles.captionError}>
                    <ErrorMessage name="password" />
                  </Text>

                  <Text style={globalStyles.textInputLabel}>
                    Enter new password
                  </Text>

                  <View
                    style={[globalStyles.textInput, { flexDirection: "row" }]}
                  >
                    <TextInput
                      style={{
                        flex: 1,
                        color: "#767676",
                        backgroundColor: "#EBEBEB",
                        fontFamily: "Poppins_400Regular",
                        fontSize: 14,
                        alignItems: "stretch",

                        ...(Platform.OS === "web" && {
                          outlineStyle: "none",
                        }),
                      }}
                      placeholder="Enter your new password"
                      onChangeText={(value) => {
                        props.handleChange("passattempt1")(value),
                          validatePassword(value),
                          setPassword1(value);
                      }}
                      value={props.values.passattempt1}
                      secureTextEntry={passwordVisibility}
                    />
                    <Pressable
                      onPress={handlePasswordVisibility}
                      style={{ alignItems: "center" }}
                    >
                      <IconMC name={rightIcon} size={22} color="#2482AA" />
                    </Pressable>
                  </View>
                  <Text style={globalStyles.captionError}>
                    <ErrorMessage name="passattempt1" />
                  </Text>
                  <Text style={globalStyles.textInputLabel}>
                    Confirm new password
                  </Text>

                  {/* Confirm password inputbox */}
                  <View
                    style={[globalStyles.textInput, { flexDirection: "row" }]}
                  >
                    <TextInput
                      style={{
                        flex: 1,
                        color: "#767676",
                        backgroundColor: "#EBEBEB",
                        fontFamily: "Poppins_400Regular",
                        fontSize: 14,
                        alignItems: "stretch",

                        ...(Platform.OS === "web" && {
                          outlineStyle: "none",
                        }),
                      }}
                      placeholder="Confirm your new password"
                      secureTextEntry={passwordVisibility}
                      onChangeText={props.handleChange("passattempt2")}
                      value={props.values.passattempt2}
                    />
                    <Pressable
                      onPress={handlePasswordVisibility}
                      style={{ alignItems: "center" }}
                    >
                      <IconMC name={rightIcon} size={22} color="#2482AA" />
                    </Pressable>
                  </View>
                  <Text style={globalStyles.captionError}>
                    <ErrorMessage name="passattempt2" />
                  </Text>

                  {/* Text style */}
                  <Text
                    style={{ fontFamily: "Poppins_500Medium", color: "black" }}
                  >
                    Password must contain:{" "}
                  </Text>
                  {suggestions.includes("L") &&
                  suggestions.includes("H") &&
                  password1.length > 0 ? (
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
                  {suggestions.includes("LC") && password1.length > 0 ? (
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
                  {suggestions.includes("UC") && password1.length > 0 ? (
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
                  {suggestions.includes("NM") && password1.length > 0 ? (
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
                  {suggestions.includes("SC") && password1.length > 0 ? (
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
                        marginBottom: 10,
                      }}
                    >
                      <IconAD name="checkcircle" size={14} color="#d8d8d8" /> At
                      least one special character
                    </Text>
                  )}

                  {/* View element gives the button an align bottom view to all mobile */}
                  <View style={{ marginTop: 24 }}>
                    {/* Save button, onpress passed to onSubmit with conditional statement on button color change. */}
                    <TouchableOpacity
                      style={[
                        globalStyles.primaryButton,
                        { borderRadius: 60 },
                        {
                          backgroundColor:
                            props.values.passattempt1.length <= 0 ||
                            props.values.passattempt2.length <= 0 ||
                            props.values.password.length
                              ? "#fbfbfb"
                              : "#2482aa",
                        },
                        {
                          borderColor:
                            props.values.passattempt1.length <= 0 ||
                            props.values.passattempt2.length <= 0 ||
                            props.values.password.length <= 0
                              ? "#123234"
                              : "",
                        },
                        {
                          borderWidth:
                            props.values.passattempt1.length <= 0 ||
                            props.values.passattempt2.length <= 0 ||
                            props.values.password.length
                              ? 2
                              : 0,
                        },
                      ]}
                      onPress={props.handleSubmit}
                    >
                      <Text
                        style={[
                          globalStyles.primaryButtonText,
                          {
                            color:
                              props.values.passattempt1.length <= 0 ||
                              props.values.passattempt2.length <= 0 ||
                              props.values.password.length
                                ? "#123234"
                                : "#fbfbfb",
                          },
                        ]}
                      >
                        {" "}
                        Save{" "}
                      </Text>
                    </TouchableOpacity>

                    {/* goBack function for the Cancel button  */}
                    <TouchableOpacity
                      style={[
                        globalStyles.secondaryButton,
                        { marginBottom: 10 },
                      ]}
                      accessibilityRole="button"
                      onPress={() => goBack()}
                    >
                      <Text
                        style={[
                          globalStyles.primaryButtonText,
                          { color: "#050505" },
                        ]}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
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
