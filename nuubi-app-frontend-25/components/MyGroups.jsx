import * as React from "react";
import {
  Text,
  View,
  Modal,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { AccountContext } from "./AccountContext";
import socket from "../socket";
import { globalStyles } from "../styles/global";
import Icon from "react-native-vector-icons/Ionicons";

export default function MyGroupsScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
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
    setSelectedTab("Groups");
  }, [user]);

  const Item = ({ title, description, id, invitePasscode }) => (
    <View>
      <TouchableOpacity
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          paddingVertical: 10,
          paddingHorizontal: 10,
          width: "100%",
          minWidth: 300,
          borderWidth: 1,
          borderRadius: 6,
          marginBottom: 10,
          borderColor: "#ddd",
          backgroundColor: "#fdfdfd",
        }}
        onPress={() => {
          setUser({
            ...user,
            currentGroup: id,
            groupName: title,
            invitePasscode: invitePasscode,
          }),
            navigation.navigate("Group Chat");
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "normal",
            color: "#333",
          }}
        >
          {description}
        </Text>
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      // headerBackVisible: false,
      headerLeft: () => (
       null
      ),
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: screenWidth > 500 ? "space-evenly" : "space-around",
            marginTop: 8,
            width: screenWidth > 500 ? screenWidth : "90%",
            marginLeft: screenWidth > 500 ? 0 : "-8%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setSelectedTab("Home");
              navigation.navigate("Home");
            }}
          >
            <View
              style={[
                {
                  borderBottomWidth: 0,
                  borderColor: "transparent",
                  marginBottom: 12,
                },
                selectedTab === "Home" && {
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
                  selectedTab === "Home" && {
                    color: "#33b7f0",
                    fontSize: 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                ]}
              >
                For you
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              //  navigation.navigate("MyGroups");
              setSelectedTab("Groups");
            }}
          >
            <View
              style={[
                globalStyles.topNavTab,
                selectedTab === "Groups" && globalStyles.topNavTabSelected,
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
                  selectedTab === "Groups" && {
                    color: "#33b7f0",
                    fontSize: 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                ]}
              >
                Your groups
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ),
      headerBackVisible: false,
    });
  }, [navigation, selectedTab]);

  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 10,
        marginTop: 10,
      }}
    >
      <View style={{ backgroundColor: "#f1f1f1", width: "100%" }}>
        <FlatList
          data={groups}
          renderItem={renderItem}
          keyExtractor={(item) => item.group_id}
        />
      </View>
    </View>
  );
}
