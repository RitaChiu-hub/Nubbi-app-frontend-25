import { ErrorMessage, Formik } from "formik";
import * as React from "react";
import {
  // Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import IconAD from "react-native-vector-icons/AntDesign";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
const { changeUsernameSchema } = require("../validationSchema");

export default function ChangeUsernameScreen({ navigation }) {
  const { goBack, navigate } = navigation;
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [username, setUsername] = React.useState("");
  const [myUsername, setMyUsername] = React.useState("");

  const getUserPoints = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getuserpoints`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setMyUsername(jsonData.username);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getUserPoints();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Update Username</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  // Tried method call, first View height: ScreenHeight || height
  // const ScreenHeight = Dimensions.get("window").height - 170;
  // const { height, width } = useWindowDimensions();

  // onlayout setting device height on first event..
  const [layoutHeight, setLayoutHeight] = React.useState(0);

  const [usernameChanged, setUsernameChanged] = React.useState(true);
  const [suggestions, setSuggestions] = React.useState([]);

  //I didn't want it to look empty so I added noSC as a condition
  const validateUser = (input) => {
    let newSuggestions = [];
    if (input.length >= 3) {
      newSuggestions.push("L");
    }
    if (input.length <= 28) {
      newSuggestions.push("H");
    }
    if (/^[a-zA-Z0-9]+$/.test(input)) {
      newSuggestions.push("nSC");
    }
    setSuggestions(newSuggestions);
  };

  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     title: "Update Username",
  //     headerTitleAlign: "center",
  //   });
  // }, [navigation]);

  return (
    <ScrollView
      style={{
        backgroundColor: "#fdfdfd",
      }}
      // Sets the layout height of the ScrollView on initial rendering.
      // Updates layoutHeight state with ScrollView height if not already set.
      onLayout={(event) => {
        if (!layoutHeight) {
          setLayoutHeight(event.nativeEvent.layout.height);
        }
      }}
    >
      {/* Main if statement for changing username only once, uncomment below code and set userState to true */}
      {/* {usernameChanged ? (
        <View style={{marginHorizontal: 20}}>
          <Text style={[globalStyles.h2HeadingMedium, { fontSize: 22 }]}>
            Username changed successfully!
          </Text>
          <TouchableOpacity
            style={[globalStyles.primaryButton, globalStyles.cancelButton]}
            onPress={() => goBack()}
          >
            <Text style={[globalStyles.primaryButtonText, { color: "#111111", fontSize: 15 }]}>Back</Text>
          </TouchableOpacity>
        </View>
):( */}
      <View
        style={{
          marginHorizontal: 20,
          height: layoutHeight,
          display: "flex",
        }}
      >
        <Text
          style={[
            globalStyles.h2HeadingMedium,
            {
              fontSize: 22,
              marginTop: 40,
              color: "#606060",
            },
          ]}
        >
          Your current username is {myUsername}.
        </Text>
        <Text
          style={[
            globalStyles.h2HeadingMedium,
            {
              fontSize: 22,
              marginTop: 40,
              color: "#606060",
            },
          ]}
        >
          Enter your new username
        </Text>

        {/* Form update or upload */}
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={changeUsernameSchema}
          onSubmit={(values, actions) => {
            const vals = { ...values };
            // const newusername = username;
            const newusername = username;
            const passattempt = vals.password;
            actions.resetForm();
            fetch(
              "https://coral-app-n96bn.ondigitalocean.app/settings/updateusername",
              //  "https://coral-app-n96bn.ondigitalocean.app/settings/updateusername",
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...user, newusername, passattempt }),
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
                console.log(data);
                setUser({ ...data });
                if (data.status) {
                  setError(data.status);
                }
                // else if (data.loggedIn) {
                //   SecureStore.setItemAsync("token", data.token);
                // }
              });
          }}
        >
          {(props) => (
            <View
              style={{
                flex: 1,
              }}
            >
              {/* Wrong password, or username taken error */}
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                }}
              >
                {error}
              </Text>

              {/* Username inputbox props.handleChange.. errormessage */}
              <TextInput
                style={[globalStyles.grayTextinput]}
                placeholder="Enter your new username"
                onChangeText={(usernameText) => {
                  setUsername(usernameText);
                  validateUser(usernameText);
                  props.handleChange("username")(usernameText);
                }}
                value={username}
              />
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                <ErrorMessage name="username" />
              </Text>

              <Text
                style={[
                  globalStyles.h2HeadingMedium,
                  {
                    fontSize: 22,
                    marginBottom: 10,
                    color: "#606060",
                  },
                ]}
              >
                Enter your password
              </Text>
              {/* Password inputbox */}
              <TextInput
                style={[globalStyles.grayTextinput, { marginBottom: 10 }]}
                placeholder="Enter your password"
                onChangeText={props.handleChange("password")}
                value={props.values.password}
                secureTextEntry={true}
              />
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                }}
              >
                <ErrorMessage name="password" />
              </Text>
              {/* Text style */}
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  color: "#606060",
                  fontSize: 16,
                  marginTop: 15,
                }}
              >
                Username must contain:{" "}
              </Text>
              {/* Low and high limit suggestions if statement */}
              {suggestions.includes("L") &&
              suggestions.includes("H") &&
              username.length > 0 ? (
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    color: "#606060",
                    fontSize: 15,
                  }}
                >
                  <IconAD name="checkcircle" size={18} color="#00A86B" /> 3 to
                  28 characters
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    color: "#606060",
                    fontSize: 15,
                  }}
                >
                  <IconAD name="checkcircle" size={18} color="#d8d8d8" /> 3 to
                  28 characters{" "}
                </Text>
              )}

              {/* No special character suggestions if statement */}
              {suggestions.includes("nSC") && username.length > 0 ? (
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    color: "#606060",
                    fontSize: 15,
                  }}
                >
                  <IconAD name="checkcircle" size={18} color="#00A86B" /> No
                  special characters{" "}
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    color: "#606060",
                    fontSize: 15,
                  }}
                >
                  <IconAD name="checkcircle" size={18} color="#d8d8d8" /> No
                  special characters{" "}
                </Text>
              )}

              {/* View element gives the button an align bottom view to all mobile */}
              <View style={{ marginTop: "auto" }}>
                {/* Save button, onpress passed to onSubmit with conditional statement on button color change. */}
                <TouchableOpacity
                  style={[
                    globalStyles.primaryButton,
                    { borderRadius: 60 },
                    {
                      backgroundColor:
                        username.length <= 0 ||
                        props.values.password.length <= 0
                          ? "#fdfdfd"
                          : "#2482aa",
                    },
                    {
                      borderColor:
                        username.length <= 0 ||
                        props.values.password.length <= 0
                          ? "#123234"
                          : "",
                    },
                    {
                      borderWidth:
                        username.length <= 0 ||
                        props.values.password.length <= 0
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
                          username.length <= 0 ||
                          props.values.password.length <= 0
                            ? "#123234"
                            : "#fdfdfd",
                      },
                    ]}
                  >
                    {" "}
                    Save{" "}
                  </Text>
                </TouchableOpacity>

                {/* goBack function for the Cancel button  */}
                <TouchableOpacity
                  style={[globalStyles.cancelButton, { marginBottom: 10 }]}
                  accessibilityRole="button"
                  onPress={() => goBack()}
                >
                  <Text
                    style={[
                      globalStyles.primaryButtonText,
                      { color: "#111111" },
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

      {/* // Edit username once ending tag uncomment below code and set userState to true */}
      {/* )} */}
    </ScrollView>
  );
}

// import * as React from "react";
// import {
//   Text,
//   View,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import * as SecureStore from "expo-secure-store";
// import { AccountContext } from "../AccountContext";
// import { globalStyles } from "../../styles/global";
// const { changeUsernameSchema } = require("../validationSchema");
// import { Formik, ErrorMessage } from "formik";

// export default function ChangeUsernameScreen({ navigation }) {
//   const { user, setUser } = React.useContext(AccountContext);
//   const [error, setError] = React.useState(null);
//   const [myUsername, setMyUsername] = React.useState("");

//   const getUserPoints = async () => {
//     try {
//       const response = await fetch(
//         `https://coral-app-n96bn.ondigitalocean.app/groups/getuserpoints`,
//         {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ ...user }),
//         }
//       );
//       const jsonData = await response.json();
//       setMyUsername(jsonData.username);
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   React.useEffect(() => {
//     getUserPoints();
//   }, []);

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       title: "Change Username",
//       headerTitleAlign: "center",
//     });
//   }, [navigation]);

//   return (
//     <ScrollView
//       style={{
//         backgroundColor: "#fdfdfd",
//       }}
//     >
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: "#fdfdfd",
//           alignItems: "center",
//           justifyContent: "center",
//           marginVertical: 50,
//           marginHorizontal: 20,
//         }}
//       >
//         <View
//           style={{
//             backgroundColor: "#fdfdfd",
//           }}
//         >
//           <Text style={{ textAlign: "center", fontSize: 16 }}>
//             Your current username is {myUsername}.
//           </Text>
//           <View style={{ marginVertical: 10 }}></View>
//           <Text style={{ fontSize: 14 }}>Your new username must have: </Text>
//           <Text> {"\u2022"} 3 characters minimum </Text>
//           <Text> {"\u2022"} 28 characters maximum </Text>
//           <Text> {"\u2022"} no whitespace or special characters</Text>
//           <Formik
//             initialValues={{ username: "", password: "" }}
//             validationSchema={changeUsernameSchema}
//             onSubmit={(values, actions) => {
//               const vals = { ...values };
//               const newusername = vals.username;
//               const passattempt = vals.password;
//               actions.resetForm();
//               fetch(
//                 "https://coral-app-n96bn.ondigitalocean.app/settings/updateusername",
//                 //  "https://coral-app-n96bn.ondigitalocean.app/settings/updateusername",
//                 {
//                   method: "POST",
//                   credentials: "include",
//                   headers: {
//                     "Content-Type": "application/json",
//                   },
//                   body: JSON.stringify({ ...user, newusername, passattempt }),
//                 }
//               )
//                 .catch((err) => {
//                   return;
//                 })
//                 .then((res) => {
//                   if (!res || !res.ok || res.status >= 400) {
//                     return;
//                   }
//                   return res.json();
//                 })
//                 .then((data) => {
//                   if (!data) return;
//                   console.log(data);
//                   setUser({ ...data });
//                   if (data.status) {
//                     setError(data.status);
//                   }
//                   // else if (data.loggedIn) {
//                   //   SecureStore.setItemAsync("token", data.token);
//                   // }
//                 });
//             }}
//           >
//             {(props) => (
//               <View>
//                 <Text
//                   style={{
//                     color: "red",
//                     textAlign: "center",
//                   }}
//                 >
//                   {error}
//                 </Text>
//                 <Text>Password</Text>
//                 <TextInput
//                   style={{
//                     borderWidth: 1,
//                     borderColor: "#ddd",
//                     padding: 10,
//                     fontSize: 18,
//                     borderRadius: 6,
//                     width: "100%",
//                     alignItems: "stretch",
//                     marginBottom: 5,
//                   }}
//                   placeholder="Enter password"
//                   onChangeText={props.handleChange("password")}
//                   value={props.values.password}
//                   secureTextEntry={true}
//                   marginBottom={10}
//                 />
//                 <Text
//                   style={{
//                     color: "red",
//                     textAlign: "center",
//                   }}
//                 >
//                   <ErrorMessage name="password" />
//                 </Text>
//                 <Text>New username</Text>
//                 <TextInput
//                   style={{
//                     borderWidth: 1,
//                     borderColor: "#ddd",
//                     padding: 10,
//                     fontSize: 18,
//                     borderRadius: 6,
//                     width: "100%",
//                     alignItems: "stretch",
//                     marginBottom: 5,
//                   }}
//                   placeholder="Enter username"
//                   onChangeText={props.handleChange("username")}
//                   value={props.values.username}
//                 />
//                 <Text
//                   style={{
//                     color: "red",
//                     textAlign: "center",
//                   }}
//                 >
//                   <ErrorMessage name="username" />
//                 </Text>
//                 <View style={{ marginVertical: 5 }}></View>
//                 <TouchableOpacity
//                   style={globalStyles.primaryButton}
//                   onPress={props.handleSubmit}
//                 >
//                   <Text style={globalStyles.primaryButtonText}>
//                     Update username
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </Formik>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }
