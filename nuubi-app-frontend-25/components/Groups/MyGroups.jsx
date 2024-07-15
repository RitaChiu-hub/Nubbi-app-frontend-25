import * as React from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { AccountContext } from "../AccountContext";
import socket from "../../socket";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";

export default function MyGroupsScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const isFocused = useIsFocused();
  const [error, setError] = React.useState(null);
  const [groups, setGroups] = React.useState([]);
  const [selectedTab, setSelectedTab] = React.useState("Groups");

  const screenWidth = Dimensions.get("window").width;

  if (user.token != null && user.token != "undefined") {
    React.useEffect(() => {
      socket.connect();
    }, []);
  } else {
    socket.disconnect();
  }

  const getGroups = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/mygroups`,
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
      setGroups(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getGroups();
  }, [isFocused]);

  React.useEffect(() => {
    setSelectedTab("Groups");
  }, [user]);

  const Item = ({ title, description, id, invitePasscode }) => (
    <View>
      <TouchableOpacity
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 16,
          minWidth: 300,
          borderWidth: 1,
          borderRadius: 16,
          marginHorizontal: 16,
          marginVertical: 8,
          borderColor: "#ddd",
          backgroundColor: "#fdfdfd",
          elevation: 15,
          shadowColor: "#333333",
          shadowOpacity: 0.5,
          shadowRadius: 2,
          shadowOffset: {
            width: 0.8,
            height: 0.8,
          },
          overflow: "visible",
        }}
        onPress={() => {
          setUser({
            ...user,
            currentGroup: id,
            groupName: title,
            invitePasscode: invitePasscode,
          });
          navigation.navigate("Group Chat");
        }}
      >
        <Text style={globalStyles.h3HeadingRegular}>{title}</Text>
        <Text style={globalStyles.bodyRegular}>{description}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      title={item.name}
      description={item.description}
      id={item.group_id}
      invitePasscode={item.invite_passcode}
    />
  );

  if (Platform.OS !== "web") {
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: () => (
          <Text style={globalStyles.h3HeadingWhite}>My Groups</Text>
        ),
        headerTitleAlign: "center",
      });
    }, [navigation]);
    // React.useLayoutEffect(() => {
    //   navigation.setOptions({
    //     headerLeft: () => null,
    //     headerTitle: () => (
    //       <View
    //         style={{
    //           flexDirection: "row",
    //           alignItems: "center",
    //           justifyContent:
    //             screenWidth > 500 ? "space-evenly" : "space-around",
    //           marginTop: 8,
    //           width: screenWidth > 500 ? screenWidth : "90%",
    //           marginLeft: screenWidth > 500 ? 0 : "-8%",
    //         }}
    //       >
    //         <TouchableOpacity
    //           onPress={() => {
    //             setSelectedTab("Home");
    //             navigation.navigate("Home");
    //           }}
    //         >
    //           <View
    //             style={[
    //               {
    //                 borderBottomWidth: 0,
    //                 borderColor: "transparent",
    //                 marginBottom: 12,
    //               },
    //               selectedTab === "Home" && {
    //                 borderBottomWidth: 2,
    //                 borderColor: "#FDFDFD",
    //               },
    //             ]}
    //           >
    //             <Text
    //               style={[
    //                 {
    //                   color: "#EBEBEB",
    //                   fontSize: 18,
    //                   fontFamily: "Poppins_600SemiBold",
    //                   letterSpacing: 0,
    //                 },
    //                 selectedTab === "Home" && {
    //                   color: "#FDFDFD",
    //                   fontSize: 18,
    //                   fontFamily: "Poppins_600SemiBold",
    //                   letterSpacing: 0,
    //                 },
    //               ]}
    //             >
    //               For me
    //             </Text>
    //           </View>
    //         </TouchableOpacity>

    //         <TouchableOpacity
    //           onPress={() => {
    //             setSelectedTab("Groups");
    //           }}
    //         >
    //           <View
    //             style={[
    //               globalStyles.topNavTab,
    //               selectedTab === "Groups" && globalStyles.topNavTabSelected,
    //             ]}
    //           >
    //             <Text
    //               style={[
    //                 {
    //                   color: "#EBEBEB",
    //                   fontSize: 18,
    //                   fontFamily: "Poppins_600SemiBold",
    //                   letterSpacing: 0,
    //                 },
    //                 selectedTab === "Groups" && {
    //                   color: "#FDFDFD",
    //                   fontSize: 18,
    //                   fontFamily: "Poppins_600SemiBold",
    //                   letterSpacing: 0,
    //                 },
    //               ]}
    //             >
    //               My groups
    //             </Text>
    //           </View>
    //         </TouchableOpacity>
    //       </View>
    //     ),
    //     headerBackVisible: false,
    //   });
    // }, [navigation, selectedTab]);
  } else {
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: () => (
          <Text style={globalStyles.h3HeadingRegular}>My Groups</Text>
        ),
        headerTitleAlign: "center",
      });
    }, [navigation]);
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 8,
        backgroundColor: "#fdfdfd",
      }}
    >
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={(item) => item.group_id}
      />
    </View>
  );
}
