import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Platform,
  ScrollView,
} from "react-native";
import FeatherIcon from "@expo/vector-icons/Feather";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import socket from "../../socket";
import * as SecureStore from "expo-secure-store";
import alert from "./../alert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Cookies from "js-cookie";

//Dynamically create setting items
// The optional attributes for each item: icon, label, type, color, navRoute or onPress
// type can be: input, link, or boolean
const SECTIONS = [
  {
    header: "",
    items: [
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
        navRoute: "NotificationSettings",
      },
      {
        label: "Privacy and Security",
        icon: "lock",
        type: "link",
        navRoute: "comingSoonAlert",
      },
      {
        label: "Contact Us",
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
        label: "Sign Out",
        icon: "log-out",
        color: "#2482AA",
        onPress: (setUser, navigation) => handleSignOut(setUser, navigation),
      },
    ],
  },
];

// External functions defined here
const handleSignOut = async (setUser, navigation) => {
  setUser({ token: null });
  if (Platform.OS === "web") {
    await logoutUser(setUser); // Pass setUser directly
  } else {
    SecureStore.deleteItemAsync("token");
    SecureStore.deleteItemAsync("user");
    AsyncStorage.setItem("isLoggedIn", JSON.stringify(false));
  }
  socket.disconnect();
};

const logoutUser = async (setUser) => {
  try {
    const response = await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include", // Include the HttpOnly cookie in the request
    });

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
        <Text style={globalStyles.h3HeadingWhite}>General Settings</Text>
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
