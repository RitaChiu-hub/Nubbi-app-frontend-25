import * as React from "react";
import {
  Text,
  View,
  FlatList,
  ScrollView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import AnalyticsDatePicker from "./AnalyticsDatePicker";
import FAIcon from "@expo/vector-icons/FontAwesome";

const BLUE = "#2582A9";

export default function GroupAnalytics({ navigation }) {
  const { user } = React.useContext(AccountContext);
  const [members, setMembers] = React.useState([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState(false);
  const [hasInitialLoad, setHasInitialLoad] = React.useState(false);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  const getWeeklyGroupInfo = async (start, end) => {
    setLoading(true);
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `https://localhost:8081/groups/getweeklygroupinfo`,
        // `https://coral-app-n96bn.ondigitalocean.app/groups/getweeklygroupinfo`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            currentGroup: user?.currentGroup,
            startDate: start,
            endDate: end,
          }),
        }
      );

      const jsonData = await response.json();
      setMembers(jsonData || []);
      setHasInitialLoad(true);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setHasInitialLoad(true);
    }
    setLoading(false);
  };

  const handleGenerateAnalytics = () => {
    if (startDate && endDate) {
      getWeeklyGroupInfo(startDate, endDate);
    }
  };

  const handleDownloadCSV = () => {
    // CSV download logic here
    console.log("Download CSV clicked");
  };

  // Load default date range on mount
  React.useEffect(() => {
    if (!startDate || !endDate) {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 28); // last 4 weeks

      const formatDate = (date) => date.toISOString().split("T")[0];
      
      setStartDate(formatDate(start));
      setEndDate(formatDate(end));
    }
  }, []);

  // Auto-load data when dates change and user/group exists
  React.useEffect(() => {
    if (user && user.currentGroup && isFocused && startDate && endDate) {
      getWeeklyGroupInfo(startDate, endDate);
    }
  }, [user?.currentGroup, isFocused, startDate, endDate]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Group Analytics</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const maxUsernameWidth = React.useMemo(
    () =>
      Math.max(
        120,
        ...members.map((member) => (member.username?.length || 12) * 10)
      ),
    [members]
  );

  const maxEmailWidth = React.useMemo(
    () =>
      Math.max(
        120,
        ...members.map((member) => (member.email?.length || 12) * 10)
      ),
    [members]
  );

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
    <View style={styles.tableRow}>
      <View
        style={{ width: maxUsernameWidth, marginHorizontal: columnSpacing }}
      >
        <Text style={styles.tableCellText}>{item.username}</Text>
      </View>
      <View style={{ width: maxEmailWidth, marginHorizontal: columnSpacing }}>
        <Text style={styles.tableCellText}>{item.email}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: totalColumnWidth + 12,
          marginHorizontal: columnSpacing,
        }}
      >
        <Text style={[styles.tableMetricText, { width: labelWidth }]}>
          {item.total?.points || 0}
        </Text>
        <Text style={[styles.tableMetricText, { width: labelWidth }]}>
          {item.total?.posts || 0}
        </Text>
        <Text style={[styles.tableMetricText, { width: labelWidth }]}>
          {item.total?.comments || 0}
        </Text>
        <Text style={[styles.tableMetricText, { width: labelWidth }]}>
          {item.total?.messages || 0}
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
            <Text style={[styles.tableMetricText, { width: labelWidth }]}>
              {weekData.points}
            </Text>
            <Text style={[styles.tableMetricText, { width: labelWidth }]}>
              {weekData.posts}
            </Text>
            <Text style={[styles.tableMetricText, { width: labelWidth }]}>
              {weekData.comments}
            </Text>
            <Text style={[styles.tableMetricText, { width: labelWidth }]}>
              {weekData.messages}
            </Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: "#fbfbfb" }}>
      {Platform.OS === "web" && (
        <TouchableOpacity
          onPress={navigation.goBack}
          accessibilityRole="button"
          style={styles.backButton}
        >
          <FAIcon
            name="chevron-left"
            size={16}
            color="#2482AA"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}

      <View style={globalStyles.container}>
        {/* Header Text */}
        <Text style={styles.headerNote}>
          📋 Analytics are groups by full weeks (Monday to Sunday)
        </Text>

        {/* TOP ROW: All Cards in Single Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.cardsGrid}>
            {/* Date Picker Card - Always Expanded */}
            <View style={styles.dateCard}>
              <Text style={styles.dateLabel}>Start Date:</Text>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={styles.dateInput}
              />
              
              <Text style={styles.dateLabel}>End Date:</Text>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={styles.dateInput}
              />

              <View style={styles.dateCardNote}>
                <Text style={styles.dateCardNoteIcon}>📅</Text>
                <Text style={styles.dateCardNoteText}>
                  Analytics are grouped by full weeks{'\n'}(Monday to Sunday)
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.generateButton}
                onPress={handleGenerateAnalytics}
              >
                <Text style={styles.generateButtonIcon}>✓</Text>
                <Text style={styles.generateButtonText}>Generate Analytics</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={handleDownloadCSV}
              >
                <Text style={styles.downloadButtonIcon}>⬇</Text>
                <Text style={styles.downloadButtonText}>Download CSV</Text>
              </TouchableOpacity>
            </View>

            {/* 80% Questions Card */}
            <View style={styles.metricCard}>
              <Text style={styles.chartIcon}>📊</Text>
              <Text style={styles.metricPercentText}>80%</Text>
              <Text style={styles.metricLabelText}>Questions</Text>
              <Text style={styles.metricSubLabelText}>Probability</Text>
            </View>

            {/* Combined Students at Risk Card */}
            <View style={styles.largeCard}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.sectionTitle}>No activity in the past week</Text>
              <Text style={styles.riskNumber}>3</Text>
              <Text style={styles.sectionTitle}>Students at Risk</Text>
              <View style={styles.cardContent}>
                <Text style={styles.placeholderText}>
                  Student list will appear here
                </Text>
              </View>
            </View>

            {/* 30% Peer Replies Card */}
            <View style={styles.metricCard}>
              <Text style={styles.chartIcon}>💬</Text>
              <Text style={styles.metricPercentText}>30%</Text>
              <Text style={styles.metricLabelText}>Peer replies received</Text>
            </View>
          </View>
        </ScrollView>

        {/* Show different content based on state */}
        {!user || !user.currentGroup ? (
          <View style={{ padding: 24, alignItems: "center", marginTop: 24 }}>
            <Text style={{ fontSize: 16, color: "#666" }}>
              Please select a group to view analytics
            </Text>
          </View>
        ) : (
          <>
            {/* TABLE HEADERS */}
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View>
                <View
                  style={[
                    globalStyles.row,
                    { alignItems: "center", marginTop: 24 },
                  ]}
                >
                  <View
                    style={{
                      width: maxUsernameWidth,
                      marginHorizontal: columnSpacing,
                    }}
                  />
                  <View
                    style={{
                      width: maxEmailWidth,
                      marginHorizontal: columnSpacing,
                    }}
                  />
                  <View
                    style={{
                      width: totalColumnWidth,
                      marginHorizontal: columnSpacing,
                    }}
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
                      <Text style={globalStyles.headingText}>
                        Week {index + 1}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={[globalStyles.row, { alignItems: "center" }]}>
                  <View
                    style={{
                      width: maxUsernameWidth,
                      marginHorizontal: columnSpacing,
                    }}
                  >
                    <Text style={globalStyles.headingText}>Username</Text>
                  </View>
                  <View
                    style={{
                      width: maxEmailWidth,
                      marginHorizontal: columnSpacing,
                    }}
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
                    <Text style={{ fontSize: 14, width: labelWidth }}>
                      Points
                    </Text>
                    <Text style={{ fontSize: 14, width: labelWidth }}>
                      Posts
                    </Text>
                    <Text style={{ fontSize: 14, width: labelWidth }}>
                      Replies
                    </Text>
                    <Text style={{ fontSize: 14, width: labelWidth }}>
                      Chats
                    </Text>
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
                      <Text style={{ fontSize: 14, width: labelWidth }}>
                        Points
                      </Text>
                      <Text style={{ fontSize: 14, width: labelWidth }}>
                        Posts
                      </Text>
                      <Text style={{ fontSize: 14, width: labelWidth }}>
                        Replies
                      </Text>
                      <Text style={{ fontSize: 14, width: labelWidth }}>
                        Chats
                      </Text>
                    </View>
                  ))}
                </View>

                {loading && !hasInitialLoad ? (
                  <View style={{ padding: 24 }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text
                      style={{
                        marginTop: 16,
                        fontSize: 16,
                        textAlign: "center",
                      }}
                    >
                      Loading analytics...
                    </Text>
                  </View>
                ) : loading ? (
                  <View style={{ padding: 24 }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                  </View>
                ) : members.length === 0 ? (
                  <View style={{ padding: 24, alignItems: "center" }}>
                    <Text style={{ fontSize: 16, color: "#666" }}>
                      No analytics data available for the selected date range
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={members}
                    renderItem={renderItem}
                    keyExtractor={(item, index) =>
                      item.user_id ? item.user_id.toString() : index.toString()
                    }
                  />
                )}
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  backButtonText: {
    color: "#2482AA",
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },

  headerNote: {
    fontSize: 14,
    color: "#666",
    marginTop: 16,
    marginBottom: 16,
    textAlign: "center",
  },

  cardsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },

  dateCard: {
    borderWidth: 4,
    borderColor: BLUE,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    padding: 25,
    flex: 1,
    maxWidth: 340,
    minWidth: 320,
    minHeight: 420,
  },

  dateLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 20,
  },

  dateInput: {
    width: "100%",
    padding: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 4,
    marginLeft: -10,
  },

  dateCardNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  dateCardNoteIcon: {
    fontSize: 16,
    marginRight: 6,
  },

  dateCardNoteText: {
    fontSize: 11,
    color: "#333",
    flex: 1,
    lineHeight: 15,
  },

  generateButton: {
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 10,
  },

  generateButtonIcon: {
    color: "#FFFFFF",
    fontSize: 16,
    marginRight: 6,
  },

  generateButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },

  downloadButton: {
    backgroundColor: "#2582A9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },

  downloadButtonIcon: {
    color: "#FFFFFF",
    fontSize: 16,
    marginRight: 6,
  },

  downloadButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },

  metricCard: {
    borderWidth: 4,
    borderColor: BLUE,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 50,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    maxWidth: 320,
  },

  largeCard: {
    borderWidth: 4,
    borderColor: BLUE,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flex: 2.5,
    minHeight: 380,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 3,
  },

  riskNumber: {
    fontSize: 56,
    fontWeight: "700",
    color: BLUE,
    textAlign: "center",
    marginVertical: 1,
  },

  cardContent: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
  },

  chartIcon: {
    fontSize: 50,
    marginBottom: 20,
  },

  metricPercentText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#000000",
  },

  metricLabelText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
    color: "#000000",
    textAlign: "center",
  },

  metricSubLabelText: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 4,
    color: BLUE,
  },

  warningIcon: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 8,
  },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  tableCellText: {
    fontSize: 16,
  },
  tableMetricText: {
    fontSize: 14,
  },
});