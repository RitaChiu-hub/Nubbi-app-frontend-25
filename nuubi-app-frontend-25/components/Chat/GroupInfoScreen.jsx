import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  SafeAreaView,
  ScrollView,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import { AccountContext } from "../AccountContext";
import FeatherIcon from "@expo/vector-icons/Feather";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";

const tabs = [
  { name: "Options", icon: "settings" },
  { name: "Leaderboard", icon: "award" },
];

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
              navigation.navigate("Group Chat");
              setSelectedTab("Chat");
            }}
          >
            <View
              style={[
                globalStyles.topNavTab,
                selectedTab === "Chat" && globalStyles.topNavTabSelected,
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
                      (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                  selectedTab === "Group" && {
                    color: "#33b7f0",
                    fontSize:
                      (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                ]}
              >
                {groupTitle + ">"}
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

  const getGroupInfo = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getgroupinfo`,
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
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getmembercount`,
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
      setMemberCount(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getMembers = async () => {
    try {
      const response = await fetch(
        "https://coral-app-n96bn.ondigitalocean.app/groups/getleaderboard",
        //   "https://coral-app-n96bn.ondigitalocean.app/groups/getleaderboard",
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
    if (Platform.OS === "web") {
      window.alert("Feature coming soon!");
    } else {
      Alert.alert("Feature coming soon!");
    }
  };

  const renderSettings = () => (
    <ScrollView style={globalStyles.container}>
      {myIsAdmin == "true" && (
        <TouchableOpacity
          style={globalStyles.row}
          onPress={() => navigation.navigate("EditGroup")}
        >
          <Text style={globalStyles.rowLabel}>Edit Group</Text>
          <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={globalStyles.row}
        onPress={() => Alert.alert("Copied to Clipboard!")}
      >
        <Text style={globalStyles.rowLabel}>
          Invitation Passcode:{" "}
          <Text
            style={[
              globalStyles.passcodeLabel,
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
        <Text style={globalStyles.rowLabel}>Group Analytics Dashboard</Text>
        <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={globalStyles.row}
        onPress={() => triggerComingSoonAlert()}
      >
        <Text style={globalStyles.rowLabel}>Moderation Dashboard</Text>
        <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={globalStyles.row}
        onPress={() => triggerComingSoonAlert()}
      >
        <Text style={globalStyles.rowLabel}>Manage Discussions</Text>
        <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={globalStyles.row}
        onPress={() => triggerComingSoonAlert()}
      >
        <Text style={globalStyles.rowLabel}>Community Roles</Text>
        <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.row}
        onPress={() => triggerComingSoonAlert()}
      >
        <Text style={globalStyles.rowLabel}>Group Files</Text>
        <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.row}
        onPress={() => triggerComingSoonAlert()}
      >
        <Text style={globalStyles.rowLabel}>Group Images</Text>
        <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.row}
        onPress={() => navigation.navigate("HelpLoggedIn")}
      >
        <Text style={globalStyles.rowLabel}>Help</Text>
        <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
      </TouchableOpacity>
      {myIsAdmin == "true" && (
        <TouchableOpacity
          style={globalStyles.row}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[globalStyles.rowLabel, { color: "red" }]}>Delete Group</Text>
        </TouchableOpacity>
      )}
      {myIsAdmin != "true" && (
        <TouchableOpacity
          style={globalStyles.row}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[globalStyles.rowLabel, { color: "red" }]}>Leave Group</Text>
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
                style={[globalStyles.modalButton, { backgroundColor: "#1aa7ec" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={globalStyles.buttonText}>No, go back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[globalStyles.modalButton, { backgroundColor: "red" }]}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("DeleteGroup");
                }}
              >
                <Text style={globalStyles.buttonText}>
                  Yes, I want to delete this group.
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );

  const renderMembers = () => (
    <View style={globalStyles.container}>
      <Text style={globalStyles.label}>{memberCount} members</Text>
      <FlatList
        data={members}
        renderItem={({ item }) => (
          <View style={globalStyles.member}>
            <Text style={globalStyles.memberText}>{item.username}</Text>
            <Text style={globalStyles.memberText}>
              {item.is_admin ? "Admin" : "Member"}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.user_id.toString()}
      />
    </View>
  );

  const Item = ({ username, is_admin, id, groupTotalPoints, email }) => (
    <View style={{ paddingTop: 6 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: screenWidth > 500 ? screenWidth * 0.7 : "100%",
          paddingBottom: 2,
          paddingHorizontal: 10,
        }}
      >
        <Text style={globalStyles.memberText}>{groupTotalPoints}</Text>
        <Text style={globalStyles.memberText}>{username}</Text>
        <Text style={globalStyles.memberText}>{is_admin ? "Admin" : "Member"}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      username={item.username}
      // email={item.email}
      is_admin={item.is_admin}
      id={item.user_id}
      groupTotalPoints={item.group_total_points}
    />
  );

  const renderLeaderboard = () => (
    <View style={globalStyles.container}>
      <Text style={globalStyles.label}>{memberCount} members</Text>
      <FlatList
        data={members}
        renderItem={renderItem}
        keyExtractor={(item) => item.user_id}
      />
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        <View style={globalStyles.header}>
          <Image
            source={{ uri: "https://via.placeholder.com/140" }}
            style={globalStyles.groupPhoto}
          />

          {/* <Text style={globalStyles.title}>{groupTitle}</Text> */}
        </View>

        <View style={globalStyles.tabs}>
          {tabs.map((tab, index) => (
            <TouchableOpacity key={index} onPress={() => handleTabPress(index)}>
              <View style={[globalStyles.tab, index === value && globalStyles.activeTab]}>
                <FeatherIcon
                  name={tab.icon}
                  size={18}
                  style={[
                    globalStyles.tabIcon,
                    index === value && globalStyles.activeTabIcon,
                  ]}
                />
                <Text
                  style={[
                    globalStyles.tabText,
                    index === value && globalStyles.activeTabText,
                  ]}
                >
                  {tab.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {value === 0 ? renderSettings() : renderLeaderboard()}
      </View>
    </SafeAreaView>
  );
}
