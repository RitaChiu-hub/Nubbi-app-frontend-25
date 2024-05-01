import * as React from "react";
import {
  Text,
  View,
  FlatList,
  Dimensions,
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
          <Text style={globalStyles.headingText}>{item.username}</Text>
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
          <Text style={globalStyles.headingText}>{item.email}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>{item.unit_1}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>{item.unit_2}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>{item.unit_3}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>{item.unit_4}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>{item.unit_5}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>{item.unit_6}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>{item.unit_7}</Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>{item.unit_8}</Text>
        </View>
        <View style={[globalStyles.column, { width: totalPointsWidth }]}>
          <Text style={globalStyles.headingText}>{item.group_total_points}</Text>
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
            <Text style={globalStyles.headingText}>Username</Text>
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
            <Text style={globalStyles.headingText}>Email</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Unit 1</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Unit 2</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Unit 3</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Unit 4</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Unit 5</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Unit 6</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Unit 7</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Unit 8</Text>
          </View>
          <View style={[globalStyles.column, { width: totalPointsWidth }]}>
            <Text style={globalStyles.headingText}>Total Points</Text>
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

