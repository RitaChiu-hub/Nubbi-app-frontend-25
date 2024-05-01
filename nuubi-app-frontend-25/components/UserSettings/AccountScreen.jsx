import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from "react-native";
import FeatherIcon from "@expo/vector-icons/Feather";
import { AccountContext } from "../AccountContext";

//Dynamically create setting items
// The optional attributes for each item: label, type, color, navRoute
// type can be: input, link, or boolean
const SECTIONS = [
  {
    header: "",
    items: [
      {
        label: "Update username",
        type: "link",
        navRoute: "ChangeUsernameScreen",
      },
      {
        label: "Update password",
        type: "link",
        navRoute: "ChangePasswordScreen",
      },
      { label: "Forgot password", type: "link", navRoute: "ForgotPassword" },
      { label: "Update email", type: "link", navRoute: "comingSoonAlert" },
      {
        label: "Update phone number",
        type: "link",
        navRoute: "comingSoonAlert",
      },
      { label: "Delete account", color: "#FF6060", navRoute: "DeleteAccount" },
    ],
  },
];

export default function AccountScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [myUsername, setMyUsername] = React.useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Account",
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
    <SafeAreaView style={globalStyles.container}>
      {SECTIONS.map(({ header, items }) => (
        <View style={globalStyles.section} key={header}>
          <View style={globalStyles.sectionHeader}>
            <Text style={globalStyles.sectionHeaderText}>{header}</Text>
          </View>
          <View style={globalStyles.sectionBody}>
            {items.map(
              ({ icon, label, type, value, color, navRoute }, index) => {
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
                      onPress={() => handleNavigation(navRoute, label)}
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
