import * as React from "react";
import {
  Text,
  View,
  FlatList,
  Dimensions,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import AnalyticsDatePicker from "./AnalyticsDatePicker";

export default function GroupAnalytics({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [members, setMembers] = React.useState([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState(false);

  const getWeeklyGroupInfo = async (startDate) => {
    setLoading(true);
    const token =
      Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : null; // Get token only on mobile
    try {
      const response = await fetch(
        //   `https://coral-app-n96bn.ondigitalocean.app/groups/getweeklygroupinfo`,
        `http://localhost:8080/groups/getweeklygroupinfo`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user, startDate }), // Include startDate in the request body
        }
      );

      const jsonData = await response.json();
      // console.log("my json data: " + JSON.stringify(jsonData));
      setMembers(jsonData);
    } catch (err) {
      console.error(err.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    const getGroupInfo = async () => {
      const token =
        Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : null; // Get token only on mobile
      try {
        const response = await fetch(
          `https://coral-app-n96bn.ondigitalocean.app/groups/getgroupinfo`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
      } catch (err) {
        console.error(err.message);
      }
    };

    getGroupInfo();
  }, [user.groupName]);

  React.useEffect(() => {
    const getMembers = async () => {
      const token =
        Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : null; // Get token only on mobile
      try {
        const apiUrl = user.isAdmin
          ? "https://coral-app-n96bn.ondigitalocean.app/groups/getmembers"
          : "https://coral-app-n96bn.ondigitalocean.app/groups/mygroupanalytics";

        const response = await fetch(apiUrl, {
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

    getMembers();
  }, [isFocused]);

  // Calculate the maximum widths outside of the renderItem function
  const maxUsernameWidth = React.useMemo(
    () =>
      Math.max(120, ...members.map((member) => member.username.length * 10)),
    [members]
  );
  const maxEmailWidth = React.useMemo(
    () => Math.max(120, ...members.map((member) => member.email.length * 10)),
    [members]
  );
  const totalPointsWidth = React.useMemo(
    () =>
      Math.max(
        120,
        ...members.map(
          (member) => String(member.group_total_points).length * 10
        ),
        "Total Points".length * 10
      ),
    [members]
  );
  const totalPostsWidth = React.useMemo(
    () =>
      Math.max(
        120,
        ...members.map((member) => String(member.total_posts).length * 10),
        "Total Posts".length * 10
      ),
    [members]
  );
  const totalPostCommentsWidth = React.useMemo(
    () =>
      Math.max(
        120,
        ...members.map((member) => String(member.total_comments).length * 10),
        "Total Post Comments".length * 10
      ),
    [members]
  );
  const totalMessagesWidth = React.useMemo(
    () =>
      Math.max(
        120,
        ...members.map((member) => String(member.total_messages).length * 10),
        "Total Messages".length * 10
      ),
    [members]
  );
  const maxUnitWidth = React.useMemo(
    () =>
      Math.max(
        120,
        ...members.map((member) => String(member.unit_1).length * 10),
        "Week 1".length * 10
      ),
    [members]
  );

  const renderItem = ({ item }) => {
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
        <View style={[globalStyles.column, { width: totalPointsWidth }]}>
          <Text style={globalStyles.headingText}>
            {String(item.group_total_points || 0)}
          </Text>
        </View>
        <View style={[globalStyles.column, { width: totalPostsWidth }]}>
          <Text style={globalStyles.headingText}>
            {String(item.total_posts || 0)}
          </Text>
        </View>
        <View style={[globalStyles.column, { width: totalPostCommentsWidth }]}>
          <Text style={globalStyles.headingText}>
            {String(item.total_comments || 0)}
          </Text>
        </View>
        <View style={[globalStyles.column, { width: totalMessagesWidth }]}>
          <Text style={globalStyles.headingText}>
            {String(item.total_messages || 0)}
          </Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>
            {String(item.unit_1 || 0)}
          </Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>
            {String(item.unit_2 || 0)}
          </Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>
            {String(item.unit_3 || 0)}
          </Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>
            {String(item.unit_4 || 0)}
          </Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>
            {String(item.unit_5 || 0)}
          </Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>
            {String(item.unit_6 || 0)}
          </Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>
            {String(item.unit_7 || 0)}
          </Text>
        </View>
        <View style={[globalStyles.column, { width: maxUnitWidth }]}>
          <Text style={globalStyles.headingText}>
            {String(item.unit_8 || 0)}
          </Text>
        </View>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Group Analytics</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView
      style={{ backgroundColor: "#fbfbfb" }}
      horizontal={true}
      vertical={true}
    >
      <View style={globalStyles.container}>
        <View
          style={{
            padding: 15,
            alignSelf: "flex-start",
          }}
        >
          <AnalyticsDatePicker onSubmit={getWeeklyGroupInfo} />
        </View>
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
          <View style={[globalStyles.column, { width: totalPointsWidth }]}>
            <Text style={globalStyles.headingText}>Total Points</Text>
          </View>
          <View style={[globalStyles.column, { width: totalPostsWidth }]}>
            <Text style={globalStyles.headingText}>Total Posts</Text>
          </View>
          <View
            style={[globalStyles.column, { width: totalPostCommentsWidth }]}
          >
            <Text style={globalStyles.headingText}>Total Comments</Text>
          </View>
          <View style={[globalStyles.column, { width: totalMessagesWidth }]}>
            <Text style={globalStyles.headingText}>Total Messages</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Week 1</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Week 2</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Week 3</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Week 4</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Week 5</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Week 6</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Week 7</Text>
          </View>
          <View style={[globalStyles.column, { width: maxUnitWidth }]}>
            <Text style={globalStyles.headingText}>Week 8</Text>
          </View>
        </View>
        {loading ? (
          <View style={{ alignSelf: "flex-start", padding: 24 }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <FlatList
            data={members}
            renderItem={renderItem}
            keyExtractor={(item) => item.user_id.toString()}
          />
        )}
      </View>
    </ScrollView>
  );
}
