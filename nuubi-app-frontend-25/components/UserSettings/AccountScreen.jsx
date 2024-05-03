import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import FeatherIcon from "@expo/vector-icons/Feather";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import alert from "./../alert";

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
      alert("Feature coming soon!");
    } else {
      navigation.navigate(navRoute);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.widthContainer}>
        {SECTIONS.map(({ header, items }) => (
          <View style={globalStyles.section} key={header}>
            <View style={globalStyles.sectionHeader}>
              <Text style={globalStyles.caption}>{header}</Text>
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
                              globalStyles.headingText,
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
    </SafeAreaView>
  );
}
