import * as React from "react";
import {
  Text,
  View,
  Modal,
  Alert,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";
import { loginStyles } from "../../styles/loginStyles";
import alert from "../alert";

export default function GroupInfoScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [memberCount, setMemberCount] = React.useState(0);
  const [error, setError] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [members, setMembers] = React.useState([]);
  const [groupTitle, setGroupTitle] = React.useState(user.groupName);
  const [selectedTab, setSelectedTab] = React.useState("Group");
  const isFocused = useIsFocused();
  const screenWidth = Dimensions.get("window").width;

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
      const dataCopy = jsonData;
      const visibilitySetting =
        dataCopy.is_public === false ? "Private" : "Public";
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

  React.useEffect(() => {
    getGroupInfo();
    setSelectedTab("Group");
  }, [user.groupName]);

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
        "http://localhost:8080/groups/getmembers",
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

  React.useEffect(() => {
    getMemberCount();
    getMembers();
    setSelectedTab("Group");
  }, [isFocused]);

  const myIsAdmin = user.isAdmin;

  const Item = ({ username, is_admin, id, groupTotalPoints, email }) => (
    <View style={{paddingTop: 6}}>
      {myIsAdmin == "true" ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: screenWidth > 500 ? screenWidth * 0.7 : "100%",
            paddingBottom: 10,
            paddingHorizontal: 10,
            backgroundColor: "red",
          }}
        >
          <Text>{groupTotalPoints}</Text>
          <Text>{username}</Text>
          <Text>{email}</Text>
          <Text>{is_admin ? "Admin" : "Member"}</Text>
        </View>
      ) : (
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
          <Text>{groupTotalPoints}</Text>
          <Text>{username}</Text>
          <Text>{is_admin ? "Admin" : "Member"}</Text>
        </View>
      )}
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      username={item.username}
      email={item.email}
      is_admin={item.is_admin}
      id={item.user_id}
      groupTotalPoints={item.group_total_points}
    />
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          labelVisible={false}
          style={{ maxWidth: 40 }}
          onPress={() => {
            navigation.navigate("MyGroups");
          }}
        />
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

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.innerContainer}>
        <Text style={{ paddingBottom: 5 }}>Group: {groupTitle}</Text>

        <Text style={{ paddingBottom: 5 }}>
          Invite passcode: {user.invitePasscode}
        </Text>

        <Text style={{ paddingBottom: 10 }}>{memberCount} members</Text>

        <Text
          style={{
            color: "red",
            textAlign: "center",
          }}
        >
          {error}
        </Text>
        <View
          style={{
            height: "50%",
            marginBottom: 10,
            marginHorizontal: 20,
            borderColor: "#cccccc",
            borderWidth: 2,
            borderRadius: 16,
          }}
        >
          <FlatList
            data={members}
            renderItem={renderItem}
            keyExtractor={(item) => item.user_id}
          />
        </View>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            position: "absolute",
            bottom: 70,
            paddingHorizontal: 20,
          }}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              alert("Modal has been closed.");
              setModalVisible(false);
            }}
          >
            <View style={globalStyles.centeredView}>
              <View style={globalStyles.modalView}>
                <Text style={{ textAlign: "center" }}>
                  Are you sure you want to PERMANENTLY delete this group? This
                  action cannot be undone.
                </Text>
                <View style={{ marginTop: 10 }}></View>
                <TouchableOpacity
                  style={globalStyles.primaryButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    No, go back
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={globalStyles.secondaryButton}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("DeleteGroup");
                  }}
                >
                  <Text
                    style={{
                      color: "red",
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Yes, I want to delete this group.
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 14,
              paddingHorizontal: 20,
              borderRadius: 60,
              elevation: 3,
              backgroundColor: "#2482AA",
              minWidth: "100%",
              marginBottom: 10,
            }}
            onPress={() => {
              alert("Coming soon!");
            }}
          >
            <Text style={loginStyles.loginButtonText}>Group Analytics</Text>
          </TouchableOpacity>

          {myIsAdmin == "true" ? (
            <View
              style={{
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderRadius: 60,
                  elevation: 3,
                  backgroundColor: "#2482AA",
                  minWidth: "100%",
                }}
                onPress={() => {
                  navigation.navigate("EditGroup");
                }}
              >
                <Text style={loginStyles.loginButtonText}>Edit Group</Text>
              </TouchableOpacity>
              <View style={{ paddingBottom: 10 }}></View>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderRadius: 60,
                  elevation: 3,
                  backgroundColor: "#2482AA",
                  minWidth: "100%",
                }}
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <Text style={loginStyles.loginButtonText}>Delete Group</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderRadius: 60,
                elevation: 3,
                backgroundColor: "#2482AA",
                minWidth: "100%",
              }}
              onPress={() => {
                fetch(
                  "http://localhost:8080/groups/leavegroup",
                  {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      ...user,
                    }),
                  }
                )
                  .catch((err) => {
                    return;
                  })
                  .then((res) => {
                    if (!res || !res.ok || res.status >= 400) {
                      return;
                    }
                    return res.json();
                  })
                  .then((data) => {
                    if (!data) return;
                    console.log(data);
                    setUser({ ...data });
                    if (data.status) {
                      setError(data.status);
                      if (data.status === "Success") {
                        navigation.navigate("Home");
                      }
                    }
                    // else if (data.loggedIn) {
                    //   SecureStore.setItemAsync("token", data.token);
                    // }
                  });
              }}
            >
              <Text style={loginStyles.loginButtonText}>Leave Group</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
