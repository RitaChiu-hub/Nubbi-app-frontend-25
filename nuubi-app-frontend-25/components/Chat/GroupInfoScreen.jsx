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
  Image,
  Dimensions,
} from "react-native";
import { AccountContext } from "../AccountContext";
import FeatherIcon from "@expo/vector-icons/Feather";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import alert from "./../alert";

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
          <Text style={globalStyles.headingText}>
            Group Analytics Dashboard
          </Text>
          <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.row}
          onPress={() => navigation.navigate("GroupAchievements")}
        >
          <Text style={globalStyles.headingText}>My Group Achievements</Text>
          <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.row}
          onPress={() => triggerComingSoonAlert()}
        >
          <Text style={globalStyles.headingText}>Community Moderation</Text>
          <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.row}
          onPress={() => triggerComingSoonAlert()}
        >
          <Text style={globalStyles.headingText}>Manage Discussions</Text>
          <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.row}
          onPress={() => triggerComingSoonAlert()}
        >
          <Text style={globalStyles.headingText}>Group Files</Text>
          <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.row}
          onPress={() => triggerComingSoonAlert()}
        >
          <Text style={globalStyles.headingText}>Group Images</Text>
          <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.row}
          onPress={() => triggerComingSoonAlert()}
        >
          <Text style={globalStyles.headingText}>Community Roles</Text>
          <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.row}
          onPress={() => navigation.navigate("HelpLoggedIn")}
        >
          <Text style={globalStyles.headingText}>Help</Text>
          <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
        </TouchableOpacity>
        {myIsAdmin == "true" && (
          <TouchableOpacity
            style={globalStyles.row}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[globalStyles.headingText, { color: "#E70808" }]}>
              Delete Group
            </Text>
          </TouchableOpacity>
        )}
        {myIsAdmin != "true" && (
          <TouchableOpacity
            style={globalStyles.row}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[globalStyles.headingText, { color: "#E70808" }]}>
              Leave Group
            </Text>
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

  const Item = ({ username, is_admin, id, groupTotalPoints, email }) => (
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
      // email={item.email}
      is_admin={item.is_admin}
      id={item.user_id}
      groupTotalPoints={item.group_total_points}
    />
  );

  const renderLeaderboard = () => (
    <View style={globalStyles.container}>
      <Text style={[globalStyles.caption, { paddingTop: 12 }]}>
        {memberCount} members
      </Text>
      <FlatList
        data={members}
        renderItem={renderItem}
        keyExtractor={(item) => item.user_id}
      />
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.container}>
        <View style={globalStyles.header}>
          <Image
            source={{ uri: "https://via.placeholder.com/140" }}
            style={[
              globalStyles.roundImageContainer,
              { maxWidth: 180, maxHeight: 180 },
            ]}
          />
        </View>
        <View style={globalStyles.tabs}>
          {tabs.map((tab, index) => (
            <TouchableOpacity key={index} onPress={() => handleTabPress(index)}>
              <View
                style={[
                  globalStyles.tab,
                  index === value && globalStyles.activeTab,
                ]}
              >
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
                    globalStyles.h3HeadingRegular,
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
