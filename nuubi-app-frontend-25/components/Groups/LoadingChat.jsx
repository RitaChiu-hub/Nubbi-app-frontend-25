import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { AccountContext } from "../AccountContext";
import socket from "../../socket";
import moment from "moment";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import FAIcon from "@expo/vector-icons/FontAwesome";

export default function LoadingGroup({ route, navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const { title } = route.params;
  const isFocused = useIsFocused();
  const [selectedTab, setSelectedTab] = React.useState("Chat");
  const screenWidth = Dimensions.get("window").width;
  const groupTitle = user.groupName;

  React.useEffect(() => {
    setUser({ ...user, groupName: title });
    navigation.navigate("Group Chat", { title: title });
  }, [isFocused]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: screenWidth > 500 ? "space-evenly" : "space-evenly",
            marginTop: 8,
            width: screenWidth > 500 ? screenWidth : "100%",
            marginLeft: screenWidth > 500 ? 0 : "-10%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate("Group Chat");
              setSelectedTab("Chat");
            }}
          >
            <View
              style={[
                {
                  borderBottomWidth: 0,
                  borderColor: "transparent",
                  marginBottom: 12,
                },
                selectedTab === "Chat" && {
                  borderBottomWidth: 2,
                  borderColor: "#33B7F0",
                },
              ]}
            >
              <Text
                style={[
                  {
                    color: "#767676",
                    fontSize: 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                  selectedTab === "Chat" && {
                    color: "#33b7f0",
                    fontSize:
                      (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                ]}
              >
                Chat
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("GroupInfo");
              setSelectedTab("Group");
            }}
          >
            <View
              style={[
                globalStyles.topNavTab,
                selectedTab === "Group" && globalStyles.topNavTabSelected,
              ]}
            >
              <Text
                style={[
                  {
                    color: "#767676",
                    fontSize:
                      (user.groupName.length >= 12) & (screenWidth < 500)
                        ? 14
                        : 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                  selectedTab === "Group" && {
                    color: "#33b7f0",
                    fontSize:
                      (user.groupName.length >= 12) & (screenWidth < 500)
                        ? 14
                        : 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                ]}
              >
                {user.groupName + ">"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("PostScreen");
              setSelectedTab("Posts");
            }}
          >
            <View
              style={[
                globalStyles.topNavTab,
                selectedTab === "Posts" && globalStyles.topNavTabSelected,
              ]}
            >
              <Text
                style={[
                  {
                    color: "#767676",
                    fontSize:
                      (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                  selectedTab === "Posts" && {
                    color: "#33b7f0",
                    fontSize:
                      (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                ]}
              >
                Posts
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, selectedTab]);

  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}
