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
import FAIcon from "@expo/vector-icons/FontAwesome";
import * as SecureStore from "expo-secure-store";

const BLUE = "#2582A9";
const API_BASE_URL = "http://localhost:8080";

export default function GroupAnalytics({ navigation }) {
  const { user } = React.useContext(AccountContext);
  const isFocused = useIsFocused();

  const [members, setMembers] = React.useState([]);
  const [analytics, setAnalytics] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [hasInitialLoad, setHasInitialLoad] = React.useState(false);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  // ---- FETCHING ----
  const getWeeklyGroupInfo = async (start, end) => {
    if (!user?.currentGroup) {
      console.log("❌ No currentGroup on user");
      return;
    }

    setLoading(true);
    console.log("🔍 Fetching analytics...");
    console.log("📅 Dates:", start, "to", end);
    console.log("🏢 Group:", user.currentGroup);

    try {
      const token =
        Platform.OS !== "web"
          ? await SecureStore.getItemAsync("token")
          : sessionStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        currentGroup: user.currentGroup,
        startDate: start,
        endDate: end,
      };

      // ---- 1) WEEKLY TABLE DATA ----
      const weeklyRes = await fetch(
        `${API_BASE_URL}/groups/getweeklygroupinfo`,
        {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify(payload),
        }
      );

      console.log("📊 weekly status", weeklyRes.status);

      let weeklyJson = null;
      try {
        weeklyJson = await weeklyRes.json();
      } catch (e) {
        console.log("❌ weekly JSON parse error:", e);
      }
      console.log("📊 weekly JSON:", weeklyJson);

      if (!weeklyRes.ok || weeklyJson?.error) {
        console.log("❌ weekly error body:", weeklyJson);
        setMembers([]);
      } else {
        setMembers(Array.isArray(weeklyJson) ? weeklyJson : []);
      }

      // ---- 2) SUMMARY ANALYTICS CARD DATA ----
      const analyticsRes = await fetch(
        `${API_BASE_URL}/groups/analytics`,
        {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify(payload),
        }
      );

      console.log("📈 analytics status", analyticsRes.status);

      let analyticsJson = null;
      try {
        analyticsJson = await analyticsRes.json();
      } catch (e) {
        console.log("❌ analytics JSON parse error:", e);
      }
      console.log("📈 analytics JSON:", analyticsJson);

      if (!analyticsRes.ok || analyticsJson?.error) {
        console.log("❌ analytics error body:", analyticsJson);
        setAnalytics(null);
      } else {
        setAnalytics(analyticsJson);
      }

      setHasInitialLoad(true);
    } catch (err) {
      console.error("❌ Error fetching analytics:", err);
      setMembers([]);
      setAnalytics(null);
      setHasInitialLoad(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnalytics = () => {
    console.log("🎯 Generate clicked!");
    if (startDate && endDate) {
      getWeeklyGroupInfo(startDate, endDate);
    } else {
      alert("Please select start and end dates");
    }
  };

  const handleDownloadCSV = () => {
    console.log("Download CSV clicked");
  };

  // Load default date range on mount (last 28 days)
  React.useEffect(() => {
    if (!startDate || !endDate) {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 28);

      const formatDate = (date) => date.toISOString().split("T")[0];

      setStartDate(formatDate(start));
      setEndDate(formatDate(end));
    }
  }, []);

  // (Optional) auto load when screen focused and dates ready
  // React.useEffect(() => {
  //   if (startDate && endDate && user?.currentGroup && isFocused) {
  //     getWeeklyGroupInfo(startDate, endDate);
  //   }
  // }, [startDate, endDate, user?.currentGroup, isFocused]);

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
    <ScrollView style={{ backgroundColor: "#fbfbfb" }} horizontal>
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
        <Text style={styles.headerNote}>
          📋 Analytics are grouped by full weeks (Monday to Sunday)
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.cardsGrid}>
            {/* Date Picker Card */}
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
                  Analytics are grouped by full weeks{"\n"}(Monday to Sunday)
                </Text>
              </View>

              <TouchableOpacity
                style={styles.generateButton}
                onPress={handleGenerateAnalytics}
              >
                <Text style={styles.generateButtonIcon}>✓</Text>
                <Text style={styles.generateButtonText}>
                  Generate Analytics
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleDownloadCSV}
              >
                <Text style={styles.downloadButtonIcon}>⬇</Text>
                <Text style={styles.downloadButtonText}>Download CSV</Text>
              </TouchableOpacity>
            </View>

            {/* Questions Card */}
            <View style={styles.metricCard}>
              <Text style={styles.chartIcon}>📊</Text>
              <Text style={styles.metricPercentText}>
                {analytics?.questions?.topicPercentage ?? 0}%
              </Text>
              <Text style={styles.metricLabelText}>of questions are about</Text>
              <Text style={styles.metricSubLabelText}>
                {analytics?.questions?.topicKeyword || "Nothing"}
              </Text>
            </View>

            {/* Students at Risk Card */}
            <View style={styles.largeCard}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.sectionTitle}>No activity in the period</Text>
              <Text style={styles.riskNumber}>
                {analytics?.atRisk?.count ?? 0}
              </Text>
              <Text style={styles.sectionTitle}>Students at Risk</Text>
              <View style={styles.cardContent}>
                {!analytics ? (
                  <Text style={styles.placeholderText}>
                    Click Generate Analytics
                  </Text>
                ) : analytics.atRisk?.students?.length === 0 ? (
                  <Text style={styles.placeholderText}>
                    No students at risk 🎉
                  </Text>
                ) : (
                  analytics.atRisk?.students?.map((s) => (
                    <Text key={s.id} style={styles.studentNameText}>
                      • {s.username}
                    </Text>
                  ))
                )}
              </View>
            </View>

            {/* Peer Replies Card */}
            <View style={styles.metricCard}>
              <Text style={styles.chartIcon}>💬</Text>
              <Text style={styles.metricPercentText}>
                {analytics?.peerReplies?.percentage ?? 0}%
              </Text>
              <Text style={styles.metricLabelText}>Peer replies received</Text>
            </View>
          </View>
        </ScrollView>

        {!user || !user.currentGroup ? (
          <View style={{ padding: 24, alignItems: "center", marginTop: 24 }}>
            <Text style={{ fontSize: 16, color: "#666" }}>
              Please select a group to view analytics
            </Text>
          </View>
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View>
                {/* Header row */}
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

                {/* Labels row */}
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

                {/* Data */}
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
  debugPanel: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#333",
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
    padding: 20,
    flex: 1,
    maxWidth: 340,
    minWidth: 320,
    minHeight: 320,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 8,
  },
  dateInput: {
    width: "100%",
    padding: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 4,
    marginLeft: 0,
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
    paddingHorizontal: 16,
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
    marginVertical: 8,
  },
  riskNumber: {
    fontSize: 56,
    fontWeight: "700",
    color: BLUE,
    textAlign: "center",
    marginVertical: 12,
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
  studentNameText: {
    fontSize: 14,
    color: "#333",
    marginVertical: 2,
    textAlign: "center",
  },
  chartIcon: {
    fontSize: 32,
    marginBottom: 8,
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