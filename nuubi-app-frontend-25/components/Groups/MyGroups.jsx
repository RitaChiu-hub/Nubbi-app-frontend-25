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
  const deviceWidth = Dimensions.get("window").width;

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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>My Groups</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

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
        style={{ flex: 1 }}
      />
      <View
        style={{
          backgroundColor: "#fdfdfd",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
        }}
      >
        {Platform.OS === "web" ? (
          <View style={globalStyles.buttonContainer}>
            <TouchableOpacity
              style={{
                paddingVertical: 18,
                paddingHorizontal: 30,
                borderRadius: 60,
                elevation: 3,
                backgroundColor: "#2482AA",
                alignItems: "center",
                justifyContent: "center",
                width: "30%",
              }}
              onPress={() => {
                navigation.navigate("CreateGroup");
              }}
            >
              <Text style={globalStyles.primaryButtonText}>
                Create New Group
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 18,
                paddingHorizontal: 30,
                borderRadius: 60,
                elevation: 3,
                backgroundColor: "#2482AA",
                alignItems: "center",
                justifyContent: "center",
                width: "30%",
              }}
              onPress={() => {
                navigation.navigate("JoinGroup");
              }}
            >
              <Text style={globalStyles.primaryButtonText}>
                Join Private Group
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 18,
                paddingHorizontal: 30,
                borderRadius: 60,
                elevation: 3,
                backgroundColor: "#2482AA",
                alignItems: "center",
                justifyContent: "center",
                width: "30%",
              }}
              onPress={() => {
                navigation.navigate("ViewAllGroups");
              }}
            >
              <Text style={globalStyles.primaryButtonText}>
                Join Public Group
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={() => {
              navigation.navigate("AddGroup");
            }}
          >
            <Text style={globalStyles.primaryButtonText}>
              Add New or Private Group
            </Text>
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={() => {
            navigation.navigate("AddGroup");
          }}
        >
          <Text style={globalStyles.primaryButtonText}>Add New or Private Group</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
