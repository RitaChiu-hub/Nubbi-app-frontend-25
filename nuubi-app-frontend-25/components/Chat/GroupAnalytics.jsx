import * as React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  ScrollView,
  Platform,
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
        //  "https://coral-app-n96bn.ondigitalocean.app/groups/getmembers",
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
    const maxUnitWidth = Math.max(
      120,
      ...members.map((member) => String(member.unit_1).length * 10),
      "Unit 1".length * 10
    );
    const totalPointsWidth = Math.max(
      120,
      ...members.map((member) => String(member.group_total_points).length * 10),
      "Total Points".length * 10
    );

    return (
      <View style={globalStyles.row}>
        <View
          style={[
            globalStyles.column,
            Platform.OS == "web"
              ? {
                  width: maxUsernameWidth + 40,
                  marginHorizontal: 20,
                  paddingHorizontal: 20,
                }
              : {
                  width: maxUsernameWidth,
                },
          ]}
        >
          <Text style={globalStyles.memberText}>{item.username}</Text>
        </View>
        <View
          style={[
            globalStyles.column,
            Platform.OS == "web"
              ? {
                  width: maxEmailWidth + 80,
                  marginHorizontal: 40,
                  paddingHorizontal: 40,
                }
              : {
                  width: maxEmailWidth,
                },
          ]}
        >
          <Text style={globalStyles.memberText}>{item.email}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.memberText}>{item.unit_1}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.memberText}>{item.unit_2}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.memberText}>{item.unit_3}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.memberText}>{item.unit_4}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.memberText}>{item.unit_5}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.memberText}>{item.unit_6}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.memberText}>{item.unit_7}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.memberText}>{item.unit_8}</Text>
        </View>
        <View style={[globalStyles.column, { width: totalPointsWidth }]}>
          <Text style={globalStyles.memberText}>{item.group_total_points}</Text>
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
  const maxUnitWidth = Math.max(
    120,
    ...members.map((member) => String(member.unit_1).length * 10),
    "Unit 1".length * 10
  );
  const totalPointsWidth = Math.max(
    120,
    ...members.map((member) => String(member.group_total_points).length * 10),
    "Total Points".length * 10
  );

  return (
    <ScrollView
      style={{ backgroundColor: "#fdfdfd" }}
      horizontal={true}
      vertical={true}
    >
      <View style={globalStyles.container}>
        <View style={globalStyles.row}>
          <View
            style={[
              globalStyles.column,
              Platform.OS == "web"
                ? {
                    width: maxUsernameWidth + 40,
                    marginHorizontal: 20,
                    paddingHorizontal: 20,
                  }
                : {
                    width: maxUsernameWidth,
                  },
            ]}
          >
            <Text style={globalStyles.memberText}>Username</Text>
          </View>
          <View
            style={[
              globalStyles.column,
              Platform.OS == "web"
                ? {
                    width: maxEmailWidth + 80,
                    marginHorizontal: 40,
                    paddingHorizontal: 40,
                  }
                : {
                    width: maxEmailWidth,
                  },
            ]}
          >
            <Text style={globalStyles.memberText}>Email</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.memberText}>Unit 1</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.memberText}>Unit 2</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.memberText}>Unit 3</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.memberText}>Unit 4</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.memberText}>Unit 5</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.memberText}>Unit 6</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.memberText}>Unit 7</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.memberText}>Unit 8</Text>
          </View>
          <View style={[globalStyles.column, { width: totalPointsWidth }]}>
            <Text style={globalStyles.memberText}>Total Points</Text>
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
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  column: {
    flex: 1,
    alignItems: "center",
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
});
