import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
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
  TextInput,
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
  // const [invitePasscode, setInvitePasscode] = React.useState(
  //   user.invitePasscode
  // );
  // const [isAdmin, setIsAdmin] = React.useState(user.isAdmin);
  const isFocused = useIsFocused();
  const [adminLoaded, setAdminLoaded] = useState(false);
  const [isAdminHere, setIsAdminHere] = useState(null);

  const [weeklyModalVisible, setWeeklyModalVisible] = useState(false);
  const [weeklyStartDate, setWeeklyStartDate] = useState("");
  const [weeklyEndDate, setWeeklyEndDate] = useState("");
  const [weeklyDayOfWeek, setWeeklyDayOfWeek] = useState("Monday");
  const [weeklyTitle, setWeeklyTitle] = useState("Weekly Takeaway");
  const [weeklyContent, setWeeklyContent] = useState(
    [
      "Hi class,",
      "",
      "Please share your thoughts about class this week.",
      "",
      "You can respond to one or more of the following questions:",
      "",
      "1. What is one thing you learned this week?",
      "2. What is one thing you are still stuck on or would like to understand better?",
      "3. What is one concept that started to make more sense to you this week?",
    ].join("\n")
  );

  // const getIsAdmin = async () => {
  //   setAdminLoaded(false);
  //   const token =
  //     Platform.OS !== "web"
  //       ? await SecureStore.getItemAsync("token")
  //       : sessionStorage.getItem("token");
  //   try {
  //     const response = await fetch(
  //       `${API_URL}/groups/isadmin`,
  //       {
  //         method: "POST",
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //           ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //         },
  //         //   body: Platform.OS === "web" ? context : JSON.stringify({ ...user }),
  //         body: JSON.stringify({ ...user }),
  //       }
  //     );
  //     const jsonData = await response.json();
  //     // setUser(jsonData);
  //     setUser((prev) => ({
  //       ...prev,
  //       isAdmin: jsonData.isAdmin,
  //       //  currentGroup: jsonData.currentGroup, // if returned here
  //     }));
  //     setAdminLoaded(true);
  //   } catch (err) {
  //     console.error(err.message);
  //     setAdminLoaded(true);
  //   }
  // };

  useEffect(() => {
    // if (!isFocused) return;
    const loadGroupData = async () => {
      setAdminLoaded(false);
      setIsAdminHere(null); // reset

      const token =
        Platform.OS !== "web"
          ? await SecureStore.getItemAsync("token")
          : sessionStorage.getItem("token");

      try {
        const [adminRes, groupRes] = await Promise.all([
          fetch(`${API_URL}/groups/isadmin`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ ...user }),
          }),
          fetch(`${API_URL}/groups/getgroupinfo`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ ...user }),
          }),
        ]);

        const adminData = await adminRes.json();
        const groupData = await groupRes.json();

        const visibilitySetting =
          groupData.is_public === false ? "Private" : "Public";

        setUser({
          ...user,
          isAdmin: adminData.isAdmin,
          groupName: groupData.groupname,
          groupDescription: groupData.description,
          visibility: visibilitySetting,
          inviteCode: groupData.invitePasscode,
        });
        setIsAdminHere(String(adminData.isAdmin) === "true");
        setAdminLoaded(true);
      } catch (err) {
        console.error("Failed to load group data:", err);
        setAdminLoaded(true);
      }
    };

    loadGroupData();
    getMembers();
    getMemberCount();
  }, [isFocused, user.currentGroup]);

  // const getGroupInfo = async () => {
  //   const token =
  //     Platform.OS !== "web"
  //       ? await SecureStore.getItemAsync("token")
  //       : sessionStorage.getItem("token");
  //   try {
  //     const response = await fetch(
  //       `${API_URL}/groups/getgroupinfo`,
  //       {
  //         method: "POST",
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //           ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //         },
  //         body: JSON.stringify({ ...user }),
  //       }
  //     );
  //     const jsonData = await response.json();
  //     const visibilitySetting =
  //       jsonData.is_public === false ? "Private" : "Public";
  //     const groupInfo = {
  //       ...jsonData,
  //       visibility: visibilitySetting,
  //       is_public: jsonData.is_public,
  //     };
  //     setUser((prev) => ({
  //       ...prev,
  //       groupName: groupInfo.groupname,
  //       groupDescription: groupInfo.description,
  //       visibility: visibilitySetting,
  //       //  currentGroup: jsonData.currentGroup ?? prev.currentGroup,
  //     }));
  //     // setUser({
  //     //   ...user,
  //     //   groupName: groupInfo.groupname,
  //     //   groupDescription: groupInfo.description,
  //     //   visibility: visibilitySetting,
  //     // });
  //     //  setGroupTitle(jsonData.groupname);
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };

  const getMemberCount = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/groups/getmembercount`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...user }),
      });
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
      const response = await fetch(`${API_URL}/groups/getleaderboard`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...user }),
      });
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
      const response = await fetch(`${API_URL}/groups/leavegroup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...user }),
      });

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

  const handleGenerateWeeklyTakeaway = () => {
    const weeklyTakeawayTitle = "Weekly Takeaway";
    const weeklyTakeawayContent = [
      "Hi class,",
      "",
      "Please share your thoughts about class this week.",
      "",
      "You can respond to one or more of the following questions:",
      "",
      "1. What is one thing you learned this week?",
      "2. What is one thing you are still stuck on or would like to understand better?",
      "3. What is one concept that started to make more sense to you this week?",
    ].join("\n");
    setWeeklyModalVisible(false);

    navigation.navigate("CreatePost", {
      defaultTitle: weeklyTakeawayTitle,
      defaultContent: weeklyTakeawayContent,
      isWeeklyTakeaway: true,
    });
  };
  const handleCreateWeeklyTakeawayPosts = () => {
    console.log("Weekly Takeaway Settings:", {
      startDate: weeklyStartDate,
      endDate: weeklyEndDate,
      dayOfWeek: weeklyDayOfWeek,
      title: weeklyTitle,
      content: weeklyContent,
    });

    alert("Weekly takeaway settings logged.");
  };

  const renderSettings = () => (
    <ScrollView>
      <View style={[globalStyles.widthContainer, { paddingHorizontal: 24 }]}>
        {adminLoaded && user.invitePasscode && (
          <TouchableOpacity style={globalStyles.row}>
            <Text style={globalStyles.headingText}>
              {user.visibility} Invitation Passcode: {user.invitePasscode}
            </Text>
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity style={globalStyles.row}>
          <Text style={globalStyles.headingText}>
            {user.visibility} Invitation Passcode: {invitePasscode}
          </Text>
        </TouchableOpacity> */}

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

        {isAdminHere === true && (
          <TouchableOpacity
            style={globalStyles.row}
            onPress={() => setWeeklyModalVisible(true)}
          >
            <View style={[globalStyles.row]}>
              <FeatherIcon
                color="#616161"
                solid
                name="calendar-plus"
                style={globalStyles.rowIcon}
                size={22}
              />
              <Text style={globalStyles.headingTextRows}>
                Generate Weekly Takeaway Post
              </Text>
            </View>
            <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
          </TouchableOpacity>
        )}

        {/* Weekly Takeaway Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={weeklyModalVisible}
          onRequestClose={() => setWeeklyModalVisible(false)}
        >
          <View style={globalStyles.centeredView}>
            <View
              style={[
                globalStyles.modalView,
                {
                  width: Platform.OS === "web" ? 760 : "90%",
                  paddingHorizontal: 40,
                  paddingVertical: 32,
                  alignItems: "stretch",
                },
              ]}
            >
              <Text
                style={[
                  globalStyles.modalText,
                  {
                    textAlign: "center",
                    marginBottom: 28,
                  },
                ]}
              >
                Generate Weekly Takeaway Post
              </Text>

              <Text style={[globalStyles.textInputLabel, { marginBottom: 12 }]}>
                Schedule
              </Text>

              <View
                style={{
                  flexDirection: Platform.OS === "web" ? "row" : "column",
                  gap: 16,
                  width: "100%",
                  marginBottom: 32,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={globalStyles.textInputLabel}>Start Date</Text>
                  {Platform.OS === "web" ? (
                    <input
                      type="date"
                      value={weeklyStartDate}
                      onChange={(e) => setWeeklyStartDate(e.target.value)}
                      style={{
                        width: "100%",
                        height: 48,
                        borderRadius: 10,
                        border: "1px solid #777",
                        padding: "0 16px",
                        fontSize: 16,
                        fontFamily: "Poppins",
                        backgroundColor: "#eeeeee",
                        boxSizing: "border-box",
                      }}
                    />
                  ) : (
                    <TextInput
                      style={[globalStyles.textInput, { width: "100%" }]}
                      placeholder="YYYY-MM-DD"
                      value={weeklyStartDate}
                      onChangeText={setWeeklyStartDate}
                    />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={globalStyles.textInputLabel}>End Date</Text>
                  {Platform.OS === "web" ? (
                    <input
                      type="date"
                      value={weeklyEndDate}
                      onChange={(e) => setWeeklyEndDate(e.target.value)}
                      style={{
                        width: "100%",
                        height: 48,
                        borderRadius: 10,
                        border: "1px solid #777",
                        padding: "0 16px",
                        fontSize: 16,
                        fontFamily: "Poppins",
                        backgroundColor: "#eeeeee",
                        boxSizing: "border-box",
                      }}
                    />
                  ) : (
                    <TextInput
                      style={[globalStyles.textInput, { width: "100%" }]}
                      placeholder="YYYY-MM-DD"
                      value={weeklyEndDate}
                      onChangeText={setWeeklyEndDate}
                    />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={globalStyles.textInputLabel}>Day of Week</Text>
                  {Platform.OS === "web" ? (
                    <select
                      value={weeklyDayOfWeek}
                      onChange={(e) => setWeeklyDayOfWeek(e.target.value)}
                      style={{
                        width: "100%",
                        height: 48,
                        borderRadius: 10,
                        border: "1px solid #777",
                        padding: "0 16px",
                        fontSize: 16,
                        fontFamily: "Poppins",
                        backgroundColor: "#eeeeee",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="Sunday">Sunday</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                    </select>
                  ) : (
                    <TextInput
                      style={[globalStyles.textInput, { width: "100%" }]}
                      placeholder="Monday"
                      value={weeklyDayOfWeek}
                      onChangeText={setWeeklyDayOfWeek}
                    />
                  )}
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={[
                    globalStyles.modalButton,
                    {
                      backgroundColor: "#A6A6A6",
                      minWidth: 120,
                    },
                  ]}
                  onPress={() => setWeeklyModalVisible(false)}
                >
                  <Text style={globalStyles.primaryButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    globalStyles.primaryButton,
                    {
                      width: 280,
                    },
                  ]}
                  onPress={handleGenerateWeeklyTakeaway}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    Continue to Create Post
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* // {isAdmin == "true" && ( */}
        {isAdminHere === true && (
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
        {isAdminHere === true && (
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
        {isAdminHere === false && (
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
                {isAdminHere === null
                  ? "Loading..."
                  : isAdminHere
                  ? "Are you sure you want to PERMANENTLY delete this group? This action cannot be undone."
                  : "Are you sure you want to leave this group?"}
              </Text>
              {/* <Text style={globalStyles.modalText}>
                {user?.isAdmin
                  ? "Are you sure you want to PERMANENTLY delete this group? This action cannot be undone."
                  : "Are you sure you want to leave this group?"}
              </Text> */}
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
                    { backgroundColor: isAdminHere ? "#E70808" : "#2482AA" },
                  ]}
                  onPress={async () => {
                    setModalVisible(false);
                    if (isAdminHere) {
                      navigation.navigate("DeleteGroup");
                    } else {
                      await leaveGroup();
                    }
                  }}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    {isAdminHere === null
                      ? "Loading..."
                      : isAdminHere
                      ? "Delete Group"
                      : "Leave Group"}
                  </Text>
                  {/* <Text style={globalStyles.primaryButtonText}>
                    {user.isAdmin ? "Delete Group" : "Leave Group"}
                  </Text> */}
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
