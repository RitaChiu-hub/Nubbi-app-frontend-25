import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  StyleSheet,
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
  // { name: "Members", icon: "users" },
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
        `http://localhost:8080/groups/getgroupinfo`,
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
        `http://localhost:8080/groups/getmembercount`,
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
        "http://localhost:8080/groups/getleaderboard",
        //   "http://localhost:8080/groups/getleaderboard",
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
    <ScrollView style={styles.container}>
      {myIsAdmin == "true" && (
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("EditGroup")}
        >
          <Text style={styles.rowLabel}>Edit Group</Text>
          <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.row}
        onPress={() => Alert.alert("Copied to Clipboard!")}
      >
        <Text style={styles.rowLabel}>
          Invitation Passcode:{" "}
          <Text
            style={[
              styles.passcodeLabel,
              { fontWeight: "bold", color: "#242424" },
            ]}
          >
            {invitePasscode}
          </Text>
        </Text>
        <FeatherIcon name="copy" color="#242424" size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate("GroupAnalytics")}
      >
        <Text style={styles.rowLabel}>Group Analytics Dashboard</Text>
        <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() => triggerComingSoonAlert()}
      >
        <Text style={styles.rowLabel}>Moderation Dashboard</Text>
        <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() => triggerComingSoonAlert()}
      >
        <Text style={styles.rowLabel}>Manage Discussions</Text>
        <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() => triggerComingSoonAlert()}
      >
        <Text style={styles.rowLabel}>Community Roles</Text>
        <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() => triggerComingSoonAlert()}
      >
        <Text style={styles.rowLabel}>Group Files</Text>
        <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() => triggerComingSoonAlert()}
      >
        <Text style={styles.rowLabel}>Group Images</Text>
        <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate("HelpLoggedIn")}
      >
        <Text style={styles.rowLabel}>Help</Text>
        <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
      </TouchableOpacity>
      {myIsAdmin == "true" && (
        <TouchableOpacity
          style={styles.row}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.rowLabel, { color: "red" }]}>Delete Group</Text>
        </TouchableOpacity>
      )}
      {myIsAdmin != "true" && (
        <TouchableOpacity
          style={styles.row}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.rowLabel, { color: "red" }]}>Leave Group</Text>
        </TouchableOpacity>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to PERMANENTLY delete this group? This
              action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#1aa7ec" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>No, go back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "red" }]}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("DeleteGroup");
                }}
              >
                <Text style={styles.buttonText}>
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
    <View style={styles.container}>
      <Text style={styles.label}>{memberCount} members</Text>
      <FlatList
        data={members}
        renderItem={({ item }) => (
          <View style={styles.member}>
            <Text style={styles.memberText}>{item.username}</Text>
            <Text style={styles.memberText}>
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
        <Text style={styles.memberText}>{groupTotalPoints}</Text>
        <Text style={styles.memberText}>{username}</Text>
        <Text style={styles.memberText}>{is_admin ? "Admin" : "Member"}</Text>
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
    <View style={styles.container}>
      <Text style={styles.label}>{memberCount} members</Text>
      <FlatList
        data={members}
        renderItem={renderItem}
        keyExtractor={(item) => item.user_id}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://via.placeholder.com/140" }}
            style={styles.groupPhoto}
          />

          {/* <Text style={styles.title}>{groupTitle}</Text> */}
        </View>

        <View style={styles.tabs}>
          {tabs.map((tab, index) => (
            <TouchableOpacity key={index} onPress={() => handleTabPress(index)}>
              <View style={[styles.tab, index === value && styles.activeTab]}>
                <FeatherIcon
                  name={tab.icon}
                  size={18}
                  style={[
                    styles.tabIcon,
                    index === value && styles.activeTabIcon,
                  ]}
                />
                <Text
                  style={[
                    styles.tabText,
                    index === value && styles.activeTabText,
                  ]}
                >
                  {tab.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {/* {value === 0 ? renderSettings() : renderMembers()} */}
        {value === 0 ? renderSettings() : renderLeaderboard()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fdfdfd",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    marginBottom: 10,
    alignItems: "center",
  },
  groupPhoto: {
    width: 140,
    height: 140,
    borderRadius: 75,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 6,
    fontFamily: "Poppins_400Regular",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    fontWeight: "500",
    color: "#929292",
  },
  passcodeLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: "#333",
  },
  tabs: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdfdfd",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderColor: "#e5e7eb",
  },
  activeTab: {
    borderBottomColor: "#33b7f0",
  },
  tabText: {
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    fontWeight: "600",
    color: "#6b7280",
    marginLeft: 5,
  },
  tabIcon: {
    color: "#6b7280",
  },
  activeTabIcon: {
    color: "#33b7f0",
  },
  activeTabText: {
    color: "#33b7f0",
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    fontWeight: "500",
    marginBottom: 10,
  },
  member: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  memberText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    fontWeight: "500",
    marginRight: 10,
    color: "#333",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    elevation: 2,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  rowLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});

// import * as React from "react";
// import {
//   Text,
//   View,
//   Modal,
//   Alert,
//   TouchableOpacity,
//   FlatList,
//   Dimensions,
// } from "react-native";
// import { AccountContext } from "../AccountContext";
// import { globalStyles } from "../../styles/global";
// import { useIsFocused } from "@react-navigation/native";
// import { HeaderBackButton } from "@react-navigation/elements";
// import { loginStyles } from "../../styles/loginStyles";
// import alert from "../alert";

// export default function GroupInfoScreen({ navigation }) {
//   const { user, setUser } = React.useContext(AccountContext);
//   const [memberCount, setMemberCount] = React.useState(0);
//   const [error, setError] = React.useState(null);
//   const [modalVisible, setModalVisible] = React.useState(false);
//   const [members, setMembers] = React.useState([]);
//   const [groupTitle, setGroupTitle] = React.useState(user.groupName);
//   const [selectedTab, setSelectedTab] = React.useState("Group");
//   const isFocused = useIsFocused();
//   const screenWidth = Dimensions.get("window").width;

//   const getGroupInfo = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:8080/groups/getgroupinfo`,
//         {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ ...user }),
//         }
//       );
//       const jsonData = await response.json();
//       const dataCopy = jsonData;
//       const visibilitySetting =
//         dataCopy.is_public === false ? "Private" : "Public";
//       const groupInfo = {
//         ...jsonData,
//         visibility: visibilitySetting,
//         is_public: jsonData.is_public,
//       };
//       setUser({
//         ...user,
//         groupName: groupInfo.groupname,
//         groupDescription: groupInfo.description,
//         visibility: visibilitySetting,
//       });
//       setGroupTitle(jsonData.groupname);
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   React.useEffect(() => {
//     getGroupInfo();
//     setSelectedTab("Group");
//   }, [user.groupName]);

//   const getMemberCount = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:8080/groups/getmembercount`,
//         {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ ...user }),
//         }
//       );
//       const jsonData = await response.json();
//       setMemberCount(jsonData);
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   const getMembers = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:8080/groups/getmembers",
//         {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ ...user }),
//         }
//       );
//       const jsonData = await response.json();
//       setMembers(jsonData);
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   React.useEffect(() => {
//     getMemberCount();
//     getMembers();
//     setSelectedTab("Group");
//   }, [isFocused]);

//   const myIsAdmin = user.isAdmin;

//   const Item = ({ username, is_admin, id, groupTotalPoints, email }) => (
//     <View style={{paddingTop: 6}}>
//       {myIsAdmin == "true" ? (
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             width: screenWidth > 500 ? screenWidth * 0.7 : "100%",
//             paddingBottom: 10,
//             paddingHorizontal: 10,
//             backgroundColor: "red",
//           }}
//         >
//           <Text>{groupTotalPoints}</Text>
//           <Text>{username}</Text>
//           <Text>{email}</Text>
//           <Text>{is_admin ? "Admin" : "Member"}</Text>
//         </View>
//       ) : (
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             width: screenWidth > 500 ? screenWidth * 0.7 : "100%",
//             paddingBottom: 2,
//             paddingHorizontal: 10,
//           }}
//         >
//           <Text>{groupTotalPoints}</Text>
//           <Text>{username}</Text>
//           <Text>{is_admin ? "Admin" : "Member"}</Text>
//         </View>
//       )}
//     </View>
//   );

//   const renderItem = ({ item }) => (
//     <Item
//       username={item.username}
//       email={item.email}
//       is_admin={item.is_admin}
//       id={item.user_id}
//       groupTotalPoints={item.group_total_points}
//     />
//   );

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerLeft: () => (
//         <HeaderBackButton
//           labelVisible={false}
//           style={{ maxWidth: 40 }}
//           onPress={() => {
//             navigation.navigate("MyGroups");
//           }}
//         />
//       ),
//       headerTitle: () => (
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: screenWidth > 500 ? "space-evenly" : "space-around",
//             marginTop: 8,
//             width: screenWidth > 500 ? screenWidth : "90%",
//             marginLeft: screenWidth > 500 ? 0 : "-8%",
//           }}
//         >
//           <TouchableOpacity
//             onPress={() => {
//               navigation.navigate("Group Chat");
//               setSelectedTab("Chat");
//             }}
//           >
//             <View
//               style={[
//                 globalStyles.topNavTab,
//                 selectedTab === "Chat" && globalStyles.topNavTabSelected,
//               ]}
//             >
//               <Text
//                 style={[
//                   {
//                     color: "#767676",
//                     fontSize:
//                       (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
//                     fontFamily: "Poppins_600SemiBold",
//                     letterSpacing: 0,
//                   },
//                   selectedTab === "Chat" && {
//                     color: "#33b7f0",
//                     fontSize:
//                       (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
//                     fontFamily: "Poppins_600SemiBold",
//                     letterSpacing: 0,
//                   },
//                 ]}
//               >
//                 Chat
//               </Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => {
//               setSelectedTab("Group");
//             }}
//           >
//             <View
//               style={[
//                 globalStyles.topNavTab,
//                 selectedTab === "Group" && globalStyles.topNavTabSelected,
//               ]}
//             >
//               <Text
//                 style={[
//                   {
//                     color: "#767676",
//                     fontSize:
//                       (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
//                     fontFamily: "Poppins_600SemiBold",
//                     letterSpacing: 0,
//                   },
//                   selectedTab === "Group" && {
//                     color: "#33b7f0",
//                     fontSize:
//                       (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
//                     fontFamily: "Poppins_600SemiBold",
//                     letterSpacing: 0,
//                   },
//                 ]}
//               >
//                 {groupTitle + ">"}
//               </Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => {
//               navigation.navigate("PostScreen");
//               setSelectedTab("Posts");
//             }}
//           >
//             <View
//               style={[
//                 globalStyles.topNavTab,
//                 selectedTab === "Posts" && globalStyles.topNavTabSelected,
//               ]}
//             >
//               <Text
//                 style={[
//                   {
//                     color: "#767676",
//                     fontSize:
//                       (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
//                     fontFamily: "Poppins_600SemiBold",
//                     letterSpacing: 0,
//                   },
//                   selectedTab === "Posts" && {
//                     color: "#33b7f0",
//                     fontSize:
//                       (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
//                     fontFamily: "Poppins_600SemiBold",
//                     letterSpacing: 0,
//                   },
//                 ]}
//               >
//                 Posts
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       ),
//     });
//   }, [navigation, selectedTab]);

//   return (
//     <View style={globalStyles.container}>
//       <View style={globalStyles.innerContainer}>
//         <Text style={{ paddingBottom: 5 }}>Group: {groupTitle}</Text>

//         <Text style={{ paddingBottom: 5 }}>
//           Invite passcode: {user.invitePasscode}
//         </Text>

//         <Text style={{ paddingBottom: 10 }}>{memberCount} members</Text>

//         <Text
//           style={{
//             color: "red",
//             textAlign: "center",
//           }}
//         >
//           {error}
//         </Text>
//         <View
//           style={{
//             height: "50%",
//             marginBottom: 10,
//             marginHorizontal: 20,
//             borderColor: "#cccccc",
//             borderWidth: 2,
//             borderRadius: 16,
//           }}
//         >
//           <FlatList
//             data={members}
//             renderItem={renderItem}
//             keyExtractor={(item) => item.user_id}
//           />
//         </View>
//         <View
//           style={{
//             width: "100%",
//             alignItems: "center",
//             position: "absolute",
//             bottom: 70,
//             paddingHorizontal: 20,
//           }}
//         >
//           <Modal
//             animationType="slide"
//             transparent={true}
//             visible={modalVisible}
//             onRequestClose={() => {
//               alert("Modal has been closed.");
//               setModalVisible(false);
//             }}
//           >
//             <View style={globalStyles.centeredView}>
//               <View style={globalStyles.modalView}>
//                 <Text style={{ textAlign: "center" }}>
//                   Are you sure you want to PERMANENTLY delete this group? This
//                   action cannot be undone.
//                 </Text>
//                 <View style={{ marginTop: 10 }}></View>
//                 <TouchableOpacity
//                   style={globalStyles.primaryButton}
//                   onPress={() => setModalVisible(false)}
//                 >
//                   <Text style={globalStyles.primaryButtonText}>
//                     No, go back
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={globalStyles.secondaryButton}
//                   onPress={() => {
//                     setModalVisible(false);
//                     navigation.navigate("DeleteGroup");
//                   }}
//                 >
//                   <Text
//                     style={{
//                       color: "red",
//                       fontSize: 18,
//                       fontWeight: "bold",
//                       textAlign: "center",
//                     }}
//                   >
//                     Yes, I want to delete this group.
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Modal>
//           <TouchableOpacity
//             style={{
//               alignItems: "center",
//               justifyContent: "center",
//               paddingVertical: 14,
//               paddingHorizontal: 20,
//               borderRadius: 60,
//               elevation: 3,
//               backgroundColor: "#2482AA",
//               minWidth: "100%",
//               marginBottom: 10,
//             }}
//             onPress={() => {
//               alert("Coming soon!");
//             }}
//           >
//             <Text style={loginStyles.loginButtonText}>Group Analytics</Text>
//           </TouchableOpacity>

//           {myIsAdmin == "true" ? (
//             <View
//               style={{
//                 alignItems: "center",
//               }}
//             >
//               <TouchableOpacity
//                 style={{
//                   alignItems: "center",
//                   justifyContent: "center",
//                   paddingVertical: 14,
//                   paddingHorizontal: 20,
//                   borderRadius: 60,
//                   elevation: 3,
//                   backgroundColor: "#2482AA",
//                   minWidth: "100%",
//                 }}
//                 onPress={() => {
//                   navigation.navigate("EditGroup");
//                 }}
//               >
//                 <Text style={loginStyles.loginButtonText}>Edit Group</Text>
//               </TouchableOpacity>
//               <View style={{ paddingBottom: 10 }}></View>
//               <TouchableOpacity
//                 style={{
//                   alignItems: "center",
//                   justifyContent: "center",
//                   paddingVertical: 14,
//                   paddingHorizontal: 20,
//                   borderRadius: 60,
//                   elevation: 3,
//                   backgroundColor: "#2482AA",
//                   minWidth: "100%",
//                 }}
//                 onPress={() => {
//                   setModalVisible(true);
//                 }}
//               >
//                 <Text style={loginStyles.loginButtonText}>Delete Group</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <TouchableOpacity
//               style={{
//                 alignItems: "center",
//                 justifyContent: "center",
//                 paddingVertical: 14,
//                 paddingHorizontal: 20,
//                 borderRadius: 60,
//                 elevation: 3,
//                 backgroundColor: "#2482AA",
//                 minWidth: "100%",
//               }}
//               onPress={() => {
//                 fetch(
//                   "http://localhost:8080/groups/leavegroup",
//                   {
//                     method: "POST",
//                     credentials: "include",
//                     headers: {
//                       "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({
//                       ...user,
//                     }),
//                   }
//                 )
//                   .catch((err) => {
//                     return;
//                   })
//                   .then((res) => {
//                     if (!res || !res.ok || res.status >= 400) {
//                       return;
//                     }
//                     return res.json();
//                   })
//                   .then((data) => {
//                     if (!data) return;
//                     console.log(data);
//                     setUser({ ...data });
//                     if (data.status) {
//                       setError(data.status);
//                       if (data.status === "Success") {
//                         navigation.navigate("Home");
//                       }
//                     }
//                     // else if (data.loggedIn) {
//                     //   SecureStore.setItemAsync("token", data.token);
//                     // }
//                   });
//               }}
//             >
//               <Text style={loginStyles.loginButtonText}>Leave Group</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// }
