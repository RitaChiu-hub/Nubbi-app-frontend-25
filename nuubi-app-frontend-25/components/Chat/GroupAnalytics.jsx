import * as React from "react";
import {
  Text,
  View,
  FlatList,
  ScrollView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import AnalyticsDatePicker from "./AnalyticsDatePicker";
import FAIcon from "@expo/vector-icons/FontAwesome";

export default function GroupAnalytics({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [members, setMembers] = React.useState([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState(false);

  const getWeeklyGroupInfo = async (startDate, endDate) => {
    setLoading(true);
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getweeklygroupinfo`,
        //  `https://coral-app-n96bn.ondigitalocean.app/groups/getweeklygroupinfo`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            currentGroup: user.currentGroup,
            startDate,
            endDate,
          }),
        }
      );

      const jsonData = await response.json();
      setMembers(jsonData);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
    setLoading(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Group Analytics</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  React.useEffect(() => {
    // Clear out previous group’s data whenever group changes or screen is focused
    setMembers([]);
  }, [user.currentGroup, isFocused]);

  const maxUsernameWidth = React.useMemo(
    () =>
      Math.max(120, ...members.map((member) => member.username.length * 10)),
    [members]
  );
  const maxEmailWidth = React.useMemo(
    () => Math.max(120, ...members.map((member) => member.email.length * 10)),
    [members]
  );

  // const weekColumns = Array.from({ length: 8 }, (_, i) => `week_${i + 1}`);

  const weekColumns = React.useMemo(() => {
    if (members.length === 0) return [];

    return Object.keys(members[0])
      .filter((key) => key.startsWith("week_"))
      .sort((a, b) => {
        const weekA = parseInt(a.split("_")[1]);
        const weekB = parseInt(b.split("_")[1]);
        return weekA - weekB;
      });
  }, [members]);

  const totalColumnWidth = 210;
  const weeklyColumnWidth = 230;
  const labelWidth = 60;
  const columnSpacing = 20;

  const renderItem = ({ item }) => (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >
      <View
        style={{ width: maxUsernameWidth, marginHorizontal: columnSpacing }}
      >
        <Text style={{ fontSize: 16 }}>{item.username}</Text>
      </View>
      <View style={{ width: maxEmailWidth, marginHorizontal: columnSpacing }}>
        <Text style={{ fontSize: 16 }}>{item.email}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: totalColumnWidth + 12,
          marginHorizontal: columnSpacing,
        }}
      >
        <Text style={{ fontSize: 14, width: labelWidth }}>
          {item.total.points}
        </Text>
        <Text style={{ fontSize: 14, width: labelWidth }}>
          {item.total.posts}
        </Text>
        <Text style={{ fontSize: 14, width: labelWidth }}>
          {item.total.comments}
        </Text>
        <Text style={{ fontSize: 14, width: labelWidth }}>
          {item.total.messages}
        </Text>
      </View>
      {weekColumns.map((week) => {
        const weekData = item[week] || {
          points: 0,
          posts: 0,
          comments: 0,
          messages: 0,
        };
        return (
          <View
            key={week}
            style={{
              flexDirection: "row",
              width: weeklyColumnWidth,
              marginHorizontal: columnSpacing,
            }}
          >
            <Text style={{ fontSize: 14, width: labelWidth }}>
              {weekData.points}
            </Text>
            <Text style={{ fontSize: 14, width: labelWidth }}>
              {weekData.posts}
            </Text>
            <Text style={{ fontSize: 14, width: labelWidth }}>
              {weekData.comments}
            </Text>
            <Text style={{ fontSize: 14, width: labelWidth }}>
              {weekData.messages}
            </Text>
          </View>
        );
      })}
      {/* {weekColumns.map((week) => (
        <View
          key={week}
          style={{
            flexDirection: "row",
            width: weeklyColumnWidth,
            marginHorizontal: columnSpacing,
          }}
        >
          <Text style={{ fontSize: 14, width: labelWidth }}>
            {item[week].points}
          </Text>
          <Text style={{ fontSize: 14, width: labelWidth }}>
            {item[week].posts}
          </Text>
          <Text style={{ fontSize: 14, width: labelWidth }}>
            {item[week].comments}
          </Text>
          <Text style={{ fontSize: 14, width: labelWidth }}>
            {item[week].messages}
          </Text>
        </View>
      ))} */}
    </View>
  );

  return (
    <ScrollView
      style={{ backgroundColor: "#fbfbfb" }}
      contentContainerStyle={{ paddingBottom: 40 }}
      horizontal
    >
      {Platform.OS === "web" && (
        <TouchableOpacity
          onPress={navigation.goBack}
          accessibilityRole="button"
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: 16,
            paddingVertical: 8,
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
          }}
        >
          <FAIcon
            name="chevron-left"
            size={16}
            color="#2482AA"
            style={{ marginRight: 4 }}
          />
          <Text
            style={{
              color: "#2482AA",
              fontSize: 18,
              fontFamily: "Poppins_600SemiBold",
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
      )}
      <View style={globalStyles.container}>
        <View style={{ padding: 15, alignSelf: "flex-start" }}>
          <AnalyticsDatePicker
            onSubmit={getWeeklyGroupInfo}
            members={members}
            weekColumns={weekColumns}
          />
        </View>

        <View style={[globalStyles.row, { alignItems: "center" }]}>
          <View
            style={{ width: maxUsernameWidth, marginHorizontal: columnSpacing }}
          />
          <View
            style={{ width: maxEmailWidth, marginHorizontal: columnSpacing }}
          />
          <View
            style={{ width: totalColumnWidth, marginHorizontal: columnSpacing }}
          >
            <Text style={globalStyles.headingText}>Total</Text>
          </View>
          {weekColumns.map((_, index) => (
            <View
              key={index}
              style={{
                width: weeklyColumnWidth,
                marginHorizontal: columnSpacing,
              }}
            >
              <Text style={globalStyles.headingText}>Week {index + 1}</Text>
            </View>
          ))}
        </View>

        <View style={[globalStyles.row, { alignItems: "center" }]}>
          <View
            style={{ width: maxUsernameWidth, marginHorizontal: columnSpacing }}
          >
            <Text style={globalStyles.headingText}>Username</Text>
          </View>
          <View
            style={{ width: maxEmailWidth, marginHorizontal: columnSpacing }}
          >
            <Text style={globalStyles.headingText}>Email</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: totalColumnWidth + 40,
              justifyContent: "space-evenly",
              marginHorizontal: columnSpacing,
            }}
          >
            <Text style={{ fontSize: 14, width: labelWidth }}>Points</Text>
            <Text style={{ fontSize: 14, width: labelWidth }}>Posts</Text>
            <Text style={{ fontSize: 14, width: labelWidth }}>Replies</Text>
            <Text style={{ fontSize: 14, width: labelWidth }}>Chats</Text>
          </View>
          {weekColumns.map((_, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                width: weeklyColumnWidth,
                justifyContent: "space-evenly",
                marginHorizontal: columnSpacing,
              }}
            >
              <Text style={{ fontSize: 14, width: labelWidth }}>Points</Text>
              <Text style={{ fontSize: 14, width: labelWidth }}>Posts</Text>
              <Text style={{ fontSize: 14, width: labelWidth }}>Replies</Text>
              <Text style={{ fontSize: 14, width: labelWidth }}>Chats</Text>
            </View>
          ))}
        </View>

        {loading ? (
          <View style={{ padding: 24 }}>
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
