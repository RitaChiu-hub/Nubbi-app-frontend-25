import * as React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";

export default function GroupAnalytics({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [members, setMembers] = React.useState([]);
  const [groupTitle, setGroupTitle] = React.useState(user.groupName);
  const isFocused = useIsFocused();
  const screenWidth = Dimensions.get("window").width;

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
    getMembers();
  }, [isFocused]);

  const myIsAdmin = user.isAdmin;

  const Item = ({ username, is_admin, id, groupTotalPoints, email }) => (
    <View style={{ paddingTop: 6 }}>
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
          <Text style={styles.memberText}>{groupTotalPoints}</Text>
          <Text style={styles.memberText}>{username}</Text>
          <Text style={styles.memberText}>{email}</Text>
          <Text style={styles.memberText}>{is_admin ? "Admin" : "Member"}</Text>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            width: screenWidth > 500 ? screenWidth * 0.7 : "100%",
            paddingBottom: 2,
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_400Regular",
              fontWeight: "500",
              marginRight: 10,
              color: "#333",
              backgroundColor: "red",
            }}
          >
            {username}
          </Text>
          <Text style={styles.memberText}>{email}</Text>
          <Text style={styles.memberText}>100</Text>
          <Text style={styles.memberText}>200</Text>
          <Text style={styles.memberText}>100</Text>
          <Text style={styles.memberText}>200</Text>
          <Text style={styles.memberText}>{groupTotalPoints}</Text>
        </View>
      )}
    </View>
  );



  const renderItem = ({ item }) => {
    // Calculate the maximum width needed for each column
    const maxUsernameWidth = Math.max(
      120,
      ...members.map((member) => member.username.length * 10)
    );
    const maxEmailWidth = Math.max(
      120,
      ...members.map((member) => member.email.length * 10)
    );
    const totalPointsWidth = Math.max(
      120,
      ...members.map((member) => String(member.group_total_points).length * 10),
      "Total Points".length * 10
    );

    return (
      <View style={styles.row}>
        <View style={[styles.column, { width: maxUsernameWidth }]}>
          <Text style={styles.memberText}>{item.username}</Text>
        </View>
        <View style={[styles.column, { width: maxEmailWidth }]}>
          <Text style={styles.memberText}>{item.email}</Text>
        </View>
        <View style={[styles.column, { width: totalPointsWidth }]}>
          <Text style={styles.memberText}>{item.group_total_points}</Text>
        </View>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Group Analytics</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const maxUsernameWidth = Math.max(
    120,
    ...members.map((member) => member.username.length * 10)
  );
  const maxEmailWidth = Math.max(
    120,
    ...members.map((member) => member.email.length * 10)
  );
  const totalPointsWidth = Math.max(
    120,
    ...members.map((member) => String(member.group_total_points).length * 10),
    "Total Points".length * 10
  );

  return (
    <ScrollView horizontal={true} vertical={true}>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={[styles.column, { width: maxUsernameWidth }]}>
            <Text style={styles.memberText}>Username</Text>
          </View>
          <View style={[styles.column, { width: maxEmailWidth }]}>
            <Text style={styles.memberText}>Email</Text>
          </View>
          <View style={[styles.column, { width: totalPointsWidth }]}>
            <Text style={styles.memberText}>Total Points</Text>
          </View>
        </View>
        <FlatList
          data={members}
          renderItem={renderItem}
          keyExtractor={(item) => item.user_id}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    marginBottom: 12,
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
  column: {
    flex: 1,
    alignItems: "center",
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
    backgroundColor: "#fff",
    marginBottom: 12,
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
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  username: {
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
  },
  padding: {
    height: "100%",
  },
});
