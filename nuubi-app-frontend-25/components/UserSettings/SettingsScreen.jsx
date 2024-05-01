import React from "react";
import {
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
        navRoute: "NotificationSettings",
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
  // navigation.navigate(Splash);
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
      } else {
        Alert.alert("Feature coming soon!");
      }
    } else {
      navigation.navigate(navRoute);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      {SECTIONS.map(({ header, items }) => (
        <View style={globalStyles.section} key={header}>
          <View style={globalStyles.sectionHeader}>
            <Text style={globalStyles.sectionHeaderText}>{header}</Text>
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
                            globalStyles.rowLabel,
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
    </SafeAreaView>
  );
}
