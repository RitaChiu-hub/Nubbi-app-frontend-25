import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  SafeAreaView,
} from "react-native";
import FeatherIcon from "@expo/vector-icons/Feather";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import socket from "../../socket";
import * as SecureStore from "expo-secure-store";

//Dynamically create setting items
// The optional attributes for each item: icon, label, type, color, navRoute or onPress
// type can be: input, link, or boolean
const SECTIONS = [
  {
    header: "",
    items: [
      {
        label: "Account",
        icon: "user",
        type: "link",
        navRoute: "AccountScreen",
      },
      {
        label: "Accessibility",
        icon: "shield",
        type: "link",
        navRoute: "comingSoonAlert",
      },
      {
        label: "Theme",
        icon: "sun",
        type: "link",
        navRoute: "comingSoonAlert",
      },
      {
        label: "Notifications",
        icon: "bell",
        type: "link",
        navRoute: "comingSoonAlert",
      },
      {
        label: "Privacy and Security",
        icon: "lock",
        type: "link",
        navRoute: "comingSoonAlert",
      },
      {
        label: "Send us your feedback",
        icon: "mail",
        type: "link",
        navRoute: "FeedbackScreen",
      },
      {
        label: "Help",
        icon: "help-circle",
        type: "link",
        navRoute: "HelpLoggedIn",
      },
      {
        label: "Sign out",
        icon: "log-out",
        color: "#33B7F0",
        onPress: (setUser, navigation) => handleSignOut(setUser, navigation),
      },
    ],
  },
];

//External functions defined here
const handleSignOut = (setUser, navigation) => {
  setUser({ token: null });
  if (Platform.OS === "web") {
    localStorage.removeItem("token");
  } else {
    SecureStore.deleteItemAsync("token");
  }
  socket.disconnect();
};

export default function SettingsScreen({ navigation }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { user, setUser } = React.useContext(AccountContext);

  const [myUsername, setMyUsername] = React.useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Settings</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const handleNavigation = (navRoute, label) => {
    if (navRoute === "" || !navRoute) {
    } else if (navRoute == "comingSoonAlert") {
      if (Platform.OS === "web") {
        window.alert("Feature coming soon!");
        console.log("Web alert!");
      } else {
        Alert.alert("Feature coming soon!");
      }
    } else {
      navigation.navigate(navRoute);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {SECTIONS.map(({ header, items }) => (
        <View style={styles.section} key={header}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{header}</Text>
          </View>
          <View style={styles.sectionBody}>
            {items.map(
              (
                { icon, label, type, value, color, navRoute, onPress },
                index
              ) => {
                const isFirst = index === 0;
                const isLast = index === items.length - 1;
                return (
                  <View
                    key={label}
                    style={[
                      styles.rowWrapper,
                      index === 0 && { borderTopWidth: 0 },
                      isFirst && styles.rowFirst,
                      isLast && styles.rowLast,
                    ]}
                  >
                    <TouchableOpacity
                      onPress={
                        onPress
                          ? () => onPress(setUser, navigation)
                          : () => handleNavigation(navRoute, label)
                      }
                    >
                      <View style={styles.row}>
                        <FeatherIcon
                          color="#616161"
                          name={icon}
                          style={styles.rowIcon}
                          size={22}
                        />

                        <Text
                          style={[
                            styles.rowLabel,
                            { color: color ? color : "#000" }, // Dynamic color based on provided color attribute
                          ]}
                        >
                          {label}
                        </Text>

                        <View style={styles.rowSpacer} />

                        {type === "input" && (
                          <Text style={styles.rowValue}>{value}</Text>
                        )}

                        {type === "boolean" && <Switch value={value} />}

                        {(type === "input" || type === "link") && (
                          <FeatherIcon
                            color="#ababab"
                            name="chevron-right"
                            size={22}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }
            )}
          </View>
        </View>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
  },
  /** Section */
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeader: {
    padding: 8,
    paddingLeft: 12,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
    color: "#adadad",
    textTransform: "uppercase",
  },
  sectionBody: {
    borderRadius: 12,
    shadowColor: "rgba(0,0,0,0.25)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#ffffff",
  },

  /** Row */
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 12,
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 0,
  },
  rowWrapper: {
    paddingLeft: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowLabel: {
    fontSize: 17,
    fontFamily: "Poppins_400Regular",
    // color will be applied dynamically
  },
  rowIcon: {
    marginRight: 12,
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 17,
    fontFamily: "Poppins_400Regular",
    color: "#ababab",
  },
});

// import * as React from "react";
// import {
//   Text,
//   View,
//   SafeAreaView,
//   Button,
//   Modal,
//   Alert,
//   TouchableOpacity,
//   Platform,
// } from "react-native";
// import { AccountContext } from "../AccountContext";
// import { globalStyles } from "../../styles/global";
// import socket from "../../socket";
// import * as SecureStore from "expo-secure-store";

// export default function SettingsScreen({ navigation }) {
//   const [modalVisible, setModalVisible] = React.useState(false);
//   const { user, setUser } = React.useContext(AccountContext);
//   // const myUsername = user.username;
//   const [userPoints, setUserPoints] = React.useState(0);
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
//       setUserPoints(jsonData.userPoints);
//       setMyUsername(jsonData.username);
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   React.useEffect(() => {
//     getUserPoints();
//   }, []);

//   const signOut = () => {
//     setUser({ token: null });
//     if (Platform.OS === "web") {
//       localStorage.removeItem("token");
//     } else {
//       SecureStore.deleteItemAsync("token");
//     }
//     socket.disconnect();
//   };

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       title: "Account & Settings",
//       headerTitleAlign: "center",
//     });
//   }, [navigation]);

//   return (
//     <SafeAreaView style={globalStyles.container}>
//       <View>
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => {
//             Alert.alert("Modal has been closed.");
//             setModalVisible(false);
//           }}
//         >
//           <View style={globalStyles.centeredView}>
//             <View style={globalStyles.modalView}>
//               <Text style={{ textAlign: "center" }}>
//                 Are you sure you want to PERMANENTLY delete your account? This
//                 action cannot be undone.
//               </Text>
//               <View style={{ marginTop: 10 }}></View>
//               <TouchableOpacity
//                 style={globalStyles.primaryButton}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={globalStyles.primaryButtonText}>No, go back</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={globalStyles.secondaryButton}
//                 onPress={() => {
//                   setModalVisible(false);
//                   navigation.navigate("DeleteAccount");
//                 }}
//               >
//                 <Text
//                   style={{
//                     color: "red",
//                     fontSize: 18,
//                     fontWeight: "bold",
//                     textAlign: "center",
//                   }}
//                 >
//                   Yes, I want to delete my account.
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//         <View style={globalStyles.innerContainer}>
//           <Text
//             style={{
//               fontSize: 24,
//               fontWeight: "bold",
//               color: "#333",
//               padding: 20,
//               marginLeft: 25,
//               marginRight: 25,
//               textAlign: "center",
//             }}
//           >
//             Hi {myUsername}!
//           </Text>
//           <Text>You have {userPoints} total points 🎉</Text>
//           <TouchableOpacity
//             style={globalStyles.secondaryButton}
//             onPress={() => {
//               navigation.navigate("ChangeUsernameScreen");
//             }}
//           >
//             <Text style={globalStyles.secondaryButtonText}>
//               Change username
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={globalStyles.secondaryButton}
//             onPress={() => {
//               navigation.navigate("ChangePasswordScreen");
//             }}
//           >
//             <Text style={globalStyles.secondaryButtonText}>
//               Change password
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={globalStyles.secondaryButton}
//             onPress={() => {
//               navigation.navigate("ForgotPassword");
//             }}
//           >
//             <Text style={globalStyles.secondaryButtonText}>
//               Forgot password
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={globalStyles.secondaryButton}
//             onPress={() => {
//               navigation.navigate("HelpLoggedIn");
//             }}
//           >
//             <Text style={globalStyles.secondaryButtonText}>Help</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={globalStyles.secondaryButton}
//             onPress={signOut}
//           >
//             <Text style={globalStyles.secondaryButtonText}>Sign out</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={globalStyles.secondaryButton}
//             onPress={() => {
//               setModalVisible(true);
//             }}
//           >
//             <Text style={globalStyles.secondaryButtonText}>Delete account</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }
