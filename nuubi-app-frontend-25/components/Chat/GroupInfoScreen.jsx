import * as React from "react";
import {
  Text,
  View,
  SafeAreaView,
  Button,
  Modal,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";

export default function GroupInfoScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [memberCount, setMemberCount] = React.useState(0);
  const [error, setError] = React.useState(null);
  //const groupTitle = user.groupName;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [members, setMembers] = React.useState([]);
  const [groupTitle, setGroupTitle] = React.useState(user.groupName);

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
  }, [user.groupName]);

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
        "https://coral-app-n96bn.ondigitalocean.app/groups/getmembers",
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
  }, []);

  const myIsAdmin = user.isAdmin;

  const Item = ({ username, is_admin, id, groupTotalPoints }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingBottom: 5,
        paddingHorizontal: 15,
      }}
    >
      <Text>{groupTotalPoints}</Text>
      <Text>{username}</Text>
      <Text>{is_admin ? "Admin" : "Member"}</Text>
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
      title: groupTitle,
      headerTitleAlign: "center",
    });
  }, [navigation, groupTitle]);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.innerContainer}>
        <Text>Invite passcode: {user.invitePasscode}</Text>

        <Text>{memberCount} members</Text>

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
          }}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
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
                  <Text style={globalStyles.secondaryButtonText}>
                    Yes!! Let me delete!!
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {myIsAdmin == "true" ? (
            <View
              style={{
                width: "100%",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={globalStyles.primaryButtonWide}
                onPress={() => {
                  navigation.navigate("EditGroup");
                }}
              >
                <Text style={globalStyles.primaryButtonText}>
                  Edit group info
                </Text>
              </TouchableOpacity>
              <View style={{ paddingBottom: 10 }}></View>
              <TouchableOpacity
                style={globalStyles.primaryButtonWide}
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <Text style={globalStyles.primaryButtonText}>Delete group</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={globalStyles.primaryButtonWide}
              onPress={() => {
                fetch(
                  "https://coral-app-n96bn.ondigitalocean.app/groups/leavegroup",
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
                    } else if (data.loggedIn) {
                      console.log("no errors I guess");
                    }
                  });
              }}
            >
              <Text style={globalStyles.primaryButtonText}>Leave group</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
