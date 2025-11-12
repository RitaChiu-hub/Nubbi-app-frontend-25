import React, { useContext } from "react";
import { API_URL } from "../../config";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Platform,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import FeatherIcon from "@expo/vector-icons/FontAwesome6";
import socket from "../../socket";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigationState } from "@react-navigation/native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";

export default function SettingsScreen({ navigation }) {
  const [showModal, setShowModal] = React.useState(false);
  const { user, setUser, isLoggedIn, setIsLoggedIn } =
    useContext(AccountContext);

  // grab the name of your top‐level screen
  const rootRouteName = useNavigationState((state) => {
    const { routes, index } = state;
    return routes[index].name;
  });

  // async function handleSignOut(
  //   user,
  //   isLoggedIn,
  //   setUser,
  //   navigation,
  //   setIsLoggedIn
  // ) {
  //   try {
  //     console.log("Signing out...");
  //     // 1) clear React state
  //     setUser({ token: null });

  //     // 2) clear storage
  //     if (Platform.OS === "web") {
  //       sessionStorage.removeItem("token");
  //     } else {
  //       await SecureStore.deleteItemAsync("token");
  //       await SecureStore.deleteItemAsync("user");
  //       await AsyncStorage.setItem("isLoggedIn", "false");
  //     }

  //     // 3) kill socket
  //     if (socket.connected) socket.disconnect();
  //     setIsLoggedIn(false);
  //   } catch (err) {
  //     console.error("Error during sign-out:", err);
  //   }
  // }

  // React.useEffect(() => {
  //   // 1) direct parent of this screen
  //   const parent1 = navigation.getParent();
  //   const p1 = parent1?.getState();
  //   const parent1Name = p1 ? p1.routes[p1.index].name : "no parent1";

  //   console.log("parent1:", parent1Name);
  // }, []);

  async function logoutUser(setUser) {
    try {
      const response = await fetch(
        `${API_URL}/auth/logout`,
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
  }

  async function handleSignOut() {
    // get your immediate parent’s active route name:
    const parent = navigation.getParent();
    const parentState = parent?.getState();
    const parentName = parentState
      ? parentState.routes[parentState.index].name
      : null;

    if (parentName === "Canvas") {
      // In canvas—just show the modal
      setShowModal(true);
      return;
    }

    try {
      // 1) clear React state
      setUser({ token: null });
      await logoutUser(setUser);

      // 2) clear storage
      if (Platform.OS === "web") {
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
      } else {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
        await AsyncStorage.setItem("isLoggedIn", "false");
      }

      // 3) kill socket
      if (socket.connected) socket.disconnect();
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Error during sign-out:", err);
    }
  }

  // rebuild your sections so you can close over setUser, navigation & setIsLoggedIn
  const sections = [
    {
      header: "",
      items: [
        {
          label: "Change Nuubi Username",
          icon: "user",
          type: "link",
          navRoute: "ChangeUsernameScreen",
        },
        {
          label: "Change Nuubi Password",
          icon: "key",
          type: "link",
          navRoute: "ChangePasswordScreen",
        },
        {
          label: "Reset Nuubi Password",
          icon: "unlock",
          type: "link",
          navRoute: "ForgotPassword",
        },
        {
          label: "Notification Settings",
          icon: "bell",
          type: "link",
          navRoute: "NotificationSettings",
        },
        {
          label: "Sign Out",
          icon: "right-from-bracket",
          color: "#2482AA",
          onPress: () =>
            handleSignOut(user, isLoggedIn, setUser, navigation, setIsLoggedIn),
        },
        {
          label: "Delete Account",
          icon: "trash",
          color: "#E70808",
          navRoute: "DeleteAccount",
        },
      ],
    },
  ];

  const handleNavigation = (navRoute) => {
    if (navRoute) navigation.navigate(navRoute);
  };

  return (
    <ScrollView style={{ backgroundColor: "#fbfbfb" }}>
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <View style={globalStyles.widthContainer}>
          {sections.map(({ header, items }) => (
            <View style={globalStyles.section} key={header}>
              <View style={globalStyles.sectionHeader}>
                <Text style={globalStyles.caption}>{header}</Text>
              </View>
              <View style={globalStyles.sectionBody}>
                {items.map(
                  ({ icon, label, type, color, navRoute, onPress }, i) => {
                    const isFirst = i === 0;
                    const isLast = i === items.length - 1;
                    return (
                      <View
                        key={label}
                        style={[
                          globalStyles.rowWrapper,
                          isFirst && globalStyles.rowFirst,
                          isLast && globalStyles.rowLast,
                        ]}
                      >
                        <TouchableOpacity
                          onPress={
                            onPress ?? (() => handleNavigation(navRoute))
                          }
                        >
                          <View style={globalStyles.row}>
                            <FeatherIcon
                              name={icon}
                              size={22}
                              color={color || "#616161"}
                              style={globalStyles.rowIcon}
                              {...{ solid: true }}
                            />
                            <Text
                              style={[
                                globalStyles.headingTextRows,
                                { color: color || "#000" },
                              ]}
                            >
                              {label}
                            </Text>
                            <View style={globalStyles.rowSpacer} />
                            {(type === "input" || type === "link") && (
                              <FeatherIcon
                                name="chevron-right"
                                size={22}
                                color="#ababab"
                              />
                            )}
                            {type === "boolean" && <Switch />}
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
        <Modal visible={showModal} transparent animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 24,
                borderRadius: 8,
                width: "80%",
              }}
            >
              <Text style={{ fontSize: 16, marginBottom: 16 }}>
                Sorry, you’re signed in via Canvas and can’t sign out here.
                Please access Nuubi directly if you need to sign out.
              </Text>
              <Pressable
                onPress={() => setShowModal(false)}
                style={{
                  alignSelf: "flex-end",
                  padding: 8,
                }}
              >
                <Text style={{ color: "#2482AA" }}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
