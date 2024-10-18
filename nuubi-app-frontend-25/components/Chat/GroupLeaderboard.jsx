import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { AccountContext } from "../AccountContext";
import FeatherIcon from "@expo/vector-icons/Feather";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

export default function GroupLeaderboardScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [memberCount, setMemberCount] = useState(0);
  const [groupTitle, setGroupTitle] = useState(user.groupName);
  const [members, setMembers] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true); // Add loading state
  const [selectedTab, setSelectedTab] = useState("Group");
  const isFocused = useIsFocused();

  useEffect(() => {
    getGroupInfo();
    getMembers();
    getMemberCount();
    setSelectedTab("Group");
  }, [isFocused]);

  const getGroupInfo = async () => {
    const token =
      Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : null; // Get token only on mobile
    try {
      const response = await fetch(
        `http://localhost:8080/groups/getgroupinfo`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      const visibilitySetting =
        jsonData.is_public === false ? "Private" : "Public";
      const groupInfo = {
        ...jsonData,
        visibility: visibilitySetting,
        is_public: jsonData.is_public,
      };
      setUser({
        ...user,
        groupName: groupInfo.groupname,
        groupDescription: groupInfo.description,
        visibility: visibilitySetting,
      });
      setGroupTitle(jsonData.groupname);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getMemberCount = async () => {
    const token =
      Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : null; // Get token only on mobile
    try {
      const response = await fetch(
        `http://localhost:8080/groups/getmembercount`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setMemberCount(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getMembers = async () => {
    const token =
      Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : null;
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        "http://localhost:8080/groups/getleaderboard",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setMembers(jsonData || []); // Ensure members is always an array
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  const Item = ({ username, is_admin, groupTotalPoints }) => (
    <View style={[globalStyles.widthContainer, { paddingHorizontal: 24 }]}>
      <View style={globalStyles.row}>
        <Text style={globalStyles.headingText}>{groupTotalPoints}</Text>
        <Text style={globalStyles.headingText}>{username}</Text>
        <Text style={globalStyles.headingText}>
          {is_admin ? "Admin" : "Member"}
        </Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      username={item.username}
      is_admin={item.is_admin}
      groupTotalPoints={item.group_total_points}
    />
  );

  const renderLeaderboard = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />; // Show loading indicator
    }

    return (
      <View style={globalStyles.container}>
        <FlatList
          data={members}
          renderItem={renderItem}
          keyExtractor={(item) => item.user_id.toString()}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.container}>{renderLeaderboard()}</View>
    </SafeAreaView>
  );
}
