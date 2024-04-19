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
            justifyContent: "space-between",
            alignItems: "center",
            width: screenWidth > 500 ? screenWidth * 0.7 : "100%",
            paddingBottom: 2,
            paddingHorizontal: 10,
          }}
        >
          <Text style={styles.memberText}>{username}</Text>
          <Text style={styles.memberText}>{email}</Text>
          <Text style={styles.memberText}>{groupTotalPoints}</Text>
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
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Group Analytics</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView horizontal={true}>
      <View style={globalStyles.container}>
        <View style={globalStyles.innerContainer}>
          <View style={styles.container}>
            <FlatList
              data={members}
              renderItem={renderItem}
              keyExtractor={(item) => item.user_id}
            />
          </View>
        </View>
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
});
