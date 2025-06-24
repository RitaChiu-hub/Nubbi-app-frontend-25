import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { AccountContext } from "../AccountContext";
import FeatherIcon from "@expo/vector-icons/FontAwesome6";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import alert from "./../alert";
import * as SecureStore from "expo-secure-store";

export default function GroupInfoScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [value, setValue] = useState(0);
  const [memberCount, setMemberCount] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [members, setMembers] = React.useState([user.members]);
  const [invitePasscode, setInvitePasscode] = React.useState(user.inviteCode);
  const [isAdmin, setIsAdmin] = React.useState(user.isAdmin);
  const isFocused = useIsFocused();


  const getIsAdmin = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8080/groups/isadmin`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          //   body: Platform.OS === "web" ? context : JSON.stringify({ ...user }),
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setUser(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getIsAdmin();
    setIsAdmin(user.isAdmin);
    getGroupInfo();
    getMembers();
    getMemberCount();
    setInvitePasscode(user.invitePasscode);
  }, [isFocused]);

  const getGroupInfo = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
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
      //  setGroupTitle(jsonData.groupname);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getMemberCount = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
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
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
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
      setMembers(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const leaveGroup = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:8080/groups/leavegroup",
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

      if (!response || !response.ok || response.status >= 400) {
        return; // Handle error appropriately
      }

      const data = await response.json();
      if (!data) return;

      setUser({ ...data });

      if (data.status) {
        setError(data.status);
        if (data.status === "Success") {
          navigation.navigate("Home");
        }
      }
    } catch (err) {
      // Handle fetch errors
      console.error("Error leaving group:", err);
    }
  };

  const handleTabPress = (index) => {
    setValue(index);
  };

  //Used to trigger a Web or iOS alert for features that are not yet implemented.
  const triggerComingSoonAlert = () => {
    alert("Feature coming soon!");
  };

  const renderSettings = () => (
    <ScrollView>
      <View style={[globalStyles.widthContainer, { paddingHorizontal: 24 }]}>
        <TouchableOpacity style={globalStyles.row}>
          <Text style={globalStyles.headingText}>
            {user.visibilitySetting} Invitation Passcode: {invitePasscode}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.row}
          onPress={() => navigation.navigate("GroupAnalytics")}
        >
          <View style={[globalStyles.row]}>
            <FeatherIcon
              color="#616161"
              solid
              name="chart-simple"
              style={globalStyles.rowIcon}
              size={22}
            />
            <Text style={globalStyles.headingTextRows}>Participation</Text>
          </View>
          <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.row}
          onPress={() => navigation.navigate("HelpLoggedIn")}
        >
          <View style={[globalStyles.row]}>
            <FeatherIcon
              color="#616161"
              solid
              name="circle-question"
              style={globalStyles.rowIcon}
              size={22}
            />
            <Text style={globalStyles.headingTextRows}>Help</Text>
          </View>
          <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
        </TouchableOpacity>
        {isAdmin == "true" && (
          <TouchableOpacity
            style={globalStyles.row}
            onPress={() => navigation.navigate("EditGroup")}
          >
            <View style={[globalStyles.row]}>
              <FeatherIcon
                color="#616161"
                solid
                name="pen-to-square"
                style={globalStyles.rowIcon}
                size={22}
              />
              <Text style={globalStyles.headingTextRows}>Edit Group</Text>
            </View>
            <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
          </TouchableOpacity>
        )}
        {isAdmin == "true" && (
          <TouchableOpacity
            style={globalStyles.row}
            onPress={() => setModalVisible(true)}
          >
            <View style={[globalStyles.row]}>
              <FeatherIcon
                color="#616161"
                solid
                name="trash"
                style={globalStyles.rowIcon}
                size={22}
              />
              <Text
                style={[globalStyles.headingTextRows, { color: "#E70808" }]}
              >
                Delete Group
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {isAdmin != "true" && (
          <TouchableOpacity
            style={globalStyles.row}
            onPress={() => setModalVisible(true)}
          >
            <View style={[globalStyles.row]}>
              <FeatherIcon
                color="#616161"
                solid
                name="right-from-bracket"
                style={globalStyles.rowIcon}
                size={22}
              />
              <Text
                style={[globalStyles.headingTextRows, { color: "#E70808" }]}
              >
                Leave Group
              </Text>
            </View>
          </TouchableOpacity>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={globalStyles.centeredView}>
            <View style={globalStyles.modalView}>
              <Text style={globalStyles.modalText}>
                {isAdmin
                  ? "Are you sure you want to PERMANENTLY delete this group? This action cannot be undone."
                  : "Are you sure you want to leave this group?"}
              </Text>
              <View style={globalStyles.modalButtons}>
                <TouchableOpacity
                  style={[
                    globalStyles.modalButton,
                    { backgroundColor: "#2482AA" },
                  ]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={globalStyles.primaryButtonText}>Cancel</Text>
                </TouchableOpacity>
                <View style={{ marginHorizontal: 10 }}></View>
                <TouchableOpacity
                  style={[
                    globalStyles.modalButton,
                    { backgroundColor: isAdmin ? "#E70808" : "#2482AA" },
                  ]}
                  onPress={async () => {
                    setModalVisible(false);
                    if (isAdmin) {
                      navigation.navigate("DeleteGroup");
                    } else {
                      await leaveGroup();
                    }
                  }}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    {isAdmin ? "Delete Group" : "Leave Group"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );

  const renderMembers = () => (
    <View style={globalStyles.container}>
      <Text style={globalStyles.caption}>{memberCount} members</Text>
      <FlatList
        data={members}
        renderItem={({ item }) => (
          <View style={globalStyles.member}>
            <Text style={globalStyles.headingText}>{item.username}</Text>
            <Text style={globalStyles.headingText}>
              {item.is_admin ? "Admin" : "Member"}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.user_id.toString()}
      />
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.container}>
        <View style={globalStyles.header}></View>
        {renderSettings()}
      </View>
    </SafeAreaView>
  );
}
