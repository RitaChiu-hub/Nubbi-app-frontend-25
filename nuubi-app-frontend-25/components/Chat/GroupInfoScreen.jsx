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
  const [groupTitle, setGroupTitle] = React.useState(user.groupName);
  const [members, setMembers] = React.useState([user.members]);
  const [invitePasscode, setInvitePasscode] = React.useState(user.inviteCode);
  const [selectedTab, setSelectedTab] = React.useState("Group");
  const screenWidth = Dimensions.get("window").width;
  const isFocused = useIsFocused();

  React.useEffect(() => {
    getGroupInfo();
    getMembers();
    getMemberCount();
    setInvitePasscode(user.invitePasscode);
    setSelectedTab("Group");
  }, [isFocused]);

  const myIsAdmin = user ? user.isAdmin : false;

  const getGroupInfo = async () => {
    const token =
      Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : null; // Get token only on mobile
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getgroupinfo`,
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
        `https://coral-app-n96bn.ondigitalocean.app/groups/getmembercount`,
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
      Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : null; // Get token only on mobile
    try {
      const response = await fetch(
        "https://coral-app-n96bn.ondigitalocean.app/groups/getleaderboard",
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
        {myIsAdmin == "true" && (
          <TouchableOpacity
            style={globalStyles.row}
            onPress={() => navigation.navigate("EditGroup")}
          >
            <Text style={globalStyles.headingText}>Edit Group</Text>
            <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={globalStyles.row}
          onPress={() => alert("Copied to Clipboard!")}
        >
          <Text style={globalStyles.headingText}>
            Invitation Passcode:{" "}
            <Text
              style={[
                globalStyles.textInputLabel,
                { fontWeight: "bold", color: "#242424" },
              ]}
            >
              {invitePasscode}
            </Text>
          </Text>
          <FeatherIcon name="copy" color="#242424" size={20} />
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
            <Text style={globalStyles.headingTextRows}>Analytics</Text>
          </View>
          <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.row}
          onPress={() => navigation.navigate("GroupAchievements")}
        >
          <View style={[globalStyles.row]}>
            <FeatherIcon
              color="#616161"
              solid
              name="trophy"
              style={globalStyles.rowIcon}
              size={22}
            />
            <Text style={globalStyles.headingTextRows}>Achievements</Text>
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
        {myIsAdmin == "true" && (
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
        {myIsAdmin != "true" && (
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
                Are you sure you want to PERMANENTLY delete this group? This
                action cannot be undone.
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
                    { backgroundColor: "#E70808" },
                  ]}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("DeleteGroup");
                  }}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    Delete Group
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
