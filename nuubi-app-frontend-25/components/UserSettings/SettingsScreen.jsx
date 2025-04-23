import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Platform,
  ScrollView,
} from "react-native";
import FeatherIcon from "@expo/vector-icons/FontAwesome6";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import socket from "../../socket";
import * as SecureStore from "expo-secure-store";
import alert from "./../alert";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Dynamically create setting items
// The optional attributes for each item: icon, label, type, color, navRoute or onPress
// type can be: input, link, or boolean
const SECTIONS = [
  {
    header: "",
    items: [
      {
        label: "Update username",
        icon: "user",
        type: "link",
        navRoute: "ChangeUsernameScreen",
      },
      {
        label: "Update password",
        icon: "key",
        type: "link",
        navRoute: "ChangePasswordScreen",
      },
      {
        label: "Forgot password",
        icon: "unlock",
        type: "link",
        navRoute: "ForgotPassword",
      },
      {
        label: "Update email",
        icon: "envelope",
        type: "link",
        navRoute: "comingSoonAlert",
      },
      {
        label: "Contact us",
        icon: "paper-plane",
        type: "link",
        navRoute: "FeedbackScreen",
      },
      {
        label: "Sign out",
        icon: "right-from-bracket",
        color: "#2482AA",
        onPress: (setUser, navigation) => handleSignOut(setUser, navigation),
      },
      {
        label: "Delete account",
        icon: "trash",
        color: "#E70808",
        navRoute: "DeleteAccount",
      },
    ],
  },
];

// External functions defined here
// const handleSignOut = async (user, setUser, navigation) => {
//   setUser({ token: null });
//   if (Platform.OS === "web") {
//     await logoutUser(setUser); // Pass setUser directly
//     sessionStorage.removeItem("token");
//   } else {
//     console.log("signing out");
//     setUser({ loggedIn: false });
//     console.log("user: " + { ...user });
//     SecureStore.deleteItemAsync("token");
//     SecureStore.deleteItemAsync("user");
//     AsyncStorage.setItem("isLoggedIn", JSON.stringify(false));
//     //  setUser({ loggedIn: false });
//   }
//   socket.disconnect();
// };

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
const handleSignOut = async (setUser, navigation) => {
  setUser({ token: null, loggedIn: false }); // Correctly resetting the user state
  if (Platform.OS === "web") {
    await logoutUser(setUser); // Pass setUser directly
    sessionStorage.removeItem("token");
    if (inviteToken) {
      // Navigate to ForgotPasswordLoggedOut with inviteToken
      navigation.navigate("Login", { inviteToken });
    }
  } else {
    SecureStore.deleteItemAsync("token");
    SecureStore.deleteItemAsync("user");
    AsyncStorage.setItem("isLoggedIn", JSON.stringify(false));
  }
  socket.disconnect();
};

const logoutUser = async (setUser) => {
  try {
    const response = await fetch(
      "https://coral-app-n96bn.ondigitalocean.app/auth/logout",
      {
        method: "POST",
        credentials: "include", // Include the HttpOnly cookie in the request
      }
    );

    const result = await response.json();

    if (!result.isLoggedIn) {
      // Clear the frontend user state after logout
      setUser({ loggedIn: false });
    }
  } catch (err) {
    console.error("Error during logout:", err);
  }
};

export default function SettingsScreen({ navigation }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { user, setUser } = React.useContext(AccountContext);

  const [myUsername, setMyUsername] = React.useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Settings</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const handleNavigation = (navRoute, label) => {
    if (navRoute === "" || !navRoute) {
    } else if (navRoute == "comingSoonAlert") {
      alert("Feature coming soon!");
    } else {
      navigation.navigate(navRoute);
    }
  };

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
        <View style={globalStyles.widthContainer}>
          {SECTIONS.map(({ header, items }) => (
            <View style={globalStyles.section} key={header}>
              <View style={globalStyles.sectionHeader}>
                <Text style={globalStyles.caption}>{header}</Text>
              </View>
              <View style={globalStyles.sectionBody}>
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
                          globalStyles.rowWrapper,
                          index === 0 && { borderTopWidth: 0 },
                          isFirst && globalStyles.rowFirst,
                          isLast && globalStyles.rowLast,
                        ]}
                      >
                        <TouchableOpacity
                          onPress={
                            onPress
                              ? () => onPress(setUser, navigation)
                              : () => handleNavigation(navRoute, label)
                          }
                        >
                          <View style={globalStyles.row}>
                            <FeatherIcon
                              color="#616161"
                              solid
                              name={icon}
                              style={globalStyles.rowIcon}
                              size={22}
                            />

                            <Text
                              style={[
                                globalStyles.headingTextRows,
                                { color: color ? color : "#000" }, // Dynamic color based on provided color attribute
                              ]}
                            >
                              {label}
                            </Text>

                            <View style={globalStyles.rowSpacer} />

                            {type === "input" && (
                              <Text style={globalStyles.rowValue}>{value}</Text>
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
        </View>
      </View>
    </ScrollView>
  );
}
