import * as React from "react";
import { API_URL } from "../../config";
import { apiFetch } from "../../api/api";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  StyleSheet,
} from "react-native";
import { AccountContext } from "../AccountContext";
import socket from "../../socket";
import { globalStyles, nuubiColors } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import { navigationRef, resetToSignIn } from "../navRef";
import { loadMergedLastViewedPosts } from "../../services/lastViewedPostsMerge";
import { emitGroupsTabUnread } from "../../services/groupsUnreadTabBridge";

export default function MyGroupsScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const isFocused = useIsFocused();
  const [error, setError] = React.useState(null);
  const [groups, setGroups] = React.useState([]);
  const [selectedTab, setSelectedTab] = React.useState("Groups");
  const [modalVisible, setModalVisible] = React.useState(false);

  const screenWidth = Dimensions.get("window").width;

  const getGroups = async () => {
    try {
      const lastViewedPosts = await loadMergedLastViewedPosts();
      const data = await apiFetch(`${API_URL}/groups/mygroups`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ ...user, lastViewedPosts }),
      });

      if (!data) {
        emitGroupsTabUnread(false);
        return;
      }

      const rows = Array.isArray(data) ? data : [];
      setGroups(rows);
      emitGroupsTabUnread(rows.some((g) => g.has_unread_activity));
    } catch (err) {
      console.error("getGroups error:", err.message);
      emitGroupsTabUnread(false);
    }
  };

  React.useEffect(() => {
    getGroups();
  }, [isFocused]);

  React.useEffect(() => {
    setSelectedTab("Groups");
  }, [user]);

  const Item = ({
    title,
    description,
    id,
    invitePasscode,
    hasUnreadActivity,
  }) => (
    <View>
      <TouchableOpacity
        style={styles.groupItem}
        onPress={() => {
          setUser({
            ...user,
            currentGroup: id,
            groupName: title,
            invitePasscode: invitePasscode,
          });
          // navigation.navigate("Group Chat");
          // navigation.navigate("Group Tabs");
          navigation.navigate("Group Tabs", { groupName: title });
          // if (Platform.OS === "web") {
          //   sessionStorage.setItem(
          //     "context",
          //     JSON.stringify({
          //       ...user,
          //       currentGroup: id,
          //       groupName: title,
          //       invitePasscode: invitePasscode,
          //     })
          // );
          // }
        }}
      >
        <View style={styles.groupTitleRow}>
          {hasUnreadActivity ? (
            <View
              style={styles.unreadDot}
              accessibilityLabel="Unread post activity in this group"
            />
          ) : null}
          <Text style={[globalStyles.h3HeadingRegular, styles.groupTitleText]}>
            {title}
          </Text>
        </View>
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
      hasUnreadActivity={!!item.has_unread_activity}
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
    <View style={{ flex: 1, paddingTop: 8, backgroundColor: "#fbfbfb" }}>
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.group_id)}
        style={{ flex: 1 }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={globalStyles.primaryButtonText}>Add New Group</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={globalStyles.centeredView}>
          <View style={globalStyles.modalView}>
            <TouchableOpacity
              style={[
                globalStyles.modalButton,
                { backgroundColor: "#2482AA", width: "100%", minWidth: 240 },
              ]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("CreateGroup");
              }}
            >
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  { textAlign: "center" },
                ]}
              >
                Create New Group
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                globalStyles.modalButton,
                {
                  backgroundColor: "#2482AA",
                  width: "100%",
                  minWidth: 240,
                  marginVertical: 10,
                },
              ]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("JoinGroup");
              }}
            >
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  { textAlign: "center" },
                ]}
              >
                Join Private Group
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                globalStyles.modalButton,
                {
                  backgroundColor: "#2482AA",
                  width: "100%",
                  minWidth: 240,
                  marginBottom: 10,
                },
              ]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("ViewAllGroups");
              }}
            >
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  { textAlign: "center" },
                ]}
              >
                Discover Public Groups
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                globalStyles.modalButton,
                { backgroundColor: "#E70808", width: "100%", minWidth: 240 },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  { textAlign: "center" },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  groupTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  groupTitleText: {
    flex: 1,
    textAlign: "left",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: nuubiColors.darkerRed,
    flexShrink: 0,
    marginRight: 10,
  },
  groupItem: {
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 16,
    minWidth: 300,
    borderWidth: 1,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderColor: "#ddd",
    backgroundColor: "#fbfbfb",
    elevation: 15,
    shadowColor: "#333333",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      width: 0.8,
      height: 0.8,
    },
  },
  buttonContainer: {
    backgroundColor: "#fbfbfb",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
