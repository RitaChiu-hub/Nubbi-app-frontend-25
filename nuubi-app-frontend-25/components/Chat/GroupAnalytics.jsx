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
  Dimensions,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import AnalyticsDatePicker from "./AnalyticsDatePicker";
import FAIcon from "@expo/vector-icons/FontAwesome";
import FeatherIcon from "@expo/vector-icons/FontAwesome6";
import config from "../../config";

export default function GroupAnalytics({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [members, setMembers] = React.useState([]);
  const [deepAnalytics, setDeepAnalytics] = React.useState(null);
  const [classStats, setClassStats] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingDeep, setLoadingDeep] = React.useState(false);
  const [showDeepAnalytics, setShowDeepAnalytics] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [selectedStudentDetail, setSelectedStudentDetail] = React.useState(null);
  const isFocused = useIsFocused();

  // Check if user is admin
  React.useEffect(() => {
    const checkAdmin = async () => {
      const token =
        Platform.OS !== "web"
          ? await SecureStore.getItemAsync("token")
          : sessionStorage.getItem("token");

      try {
        const response = await fetch(
          `${config.API_BASE_URL}/groups/isadmin`,
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
        const data = await response.json();
        setIsAdmin(String(data.isAdmin) === "true");
      } catch (err) {
        console.error("Failed to check admin status:", err);
      }
    };

    if (isFocused) {
      checkAdmin();
    }
  }, [isFocused, user.currentGroup]);

  const getWeeklyGroupInfo = async (startDate, endDate) => {
    setLoading(true);
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `${config.API_BASE_URL}/groups/getweeklygroupinfo`,
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

  const getDeepAnalytics = async (startDate, endDate) => {
    if (!isAdmin) return;

    setLoadingDeep(true);
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `${config.API_BASE_URL}/groups/studentparticipationanalytics`,
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

      if (!response.ok) {
        if (response.status === 403) {
          alert("Access denied. Only professors and TAs can view deep analytics.");
          return;
        }
        throw new Error("Failed to fetch deep analytics");
      }

      const jsonData = await response.json();
      setDeepAnalytics(jsonData.analytics || []);
      setClassStats(jsonData.class_statistics || null);
      setShowDeepAnalytics(true);
      
      // If a student was previously selected, update their detail
      if (selectedStudent) {
        const student = jsonData.analytics?.find(s => s.user_id === selectedStudent);
        setSelectedStudentDetail(student || null);
      }
    } catch (err) {
      console.error("Failed to fetch deep analytics:", err);
      alert("Failed to load deep analytics. Please try again.");
    }
    setLoadingDeep(false);
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
    setMembers([]);
    setDeepAnalytics(null);
    setClassStats(null);
    setShowDeepAnalytics(false);
    setSelectedStudent(null);
    setSelectedStudentDetail(null);
  }, [user.currentGroup, isFocused]);

  const formatTime = (seconds) => {
    if (!seconds) return "0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const renderClassStatistics = () => {
    if (!classStats || !showDeepAnalytics) return null;

    return (
      <View style={styles.classStatsContainer}>
        <View style={styles.classStatsHeader}>
          <FeatherIcon name="users" size={20} color="#2482AA" />
          <Text style={styles.classStatsTitle}>Class Statistics</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{classStats.total_students}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{classStats.avg_sessions}</Text>
            <Text style={styles.statLabel}>Avg Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{classStats.avg_active_hours}h</Text>
            <Text style={styles.statLabel}>Avg Active Time</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{classStats.avg_points}</Text>
            <Text style={styles.statLabel}>Avg Points</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{classStats.avg_posts}</Text>
            <Text style={styles.statLabel}>Avg Posts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{classStats.avg_comments}</Text>
            <Text style={styles.statLabel}>Avg Comments</Text>
          </View>
        </View>

        {classStats.top_performer && (
          <View style={styles.topPerformerCard}>
            <Text style={styles.topPerformerLabel}>🏆 Top Performer</Text>
            <Text style={styles.topPerformerName}>{classStats.top_performer.username}</Text>
            <Text style={styles.topPerformerScore}>
              Engagement Score: {classStats.top_performer.engagement_score}
            </Text>
          </View>
        )}

        {classStats.needs_attention && classStats.needs_attention.length > 0 && (
          <View style={styles.attentionCard}>
            <Text style={styles.attentionLabel}>⚠️ Students Needing Attention</Text>
            {classStats.needs_attention.map((student, idx) => (
              <View key={idx} style={styles.attentionItem}>
                <Text style={styles.attentionName}>• {student.username}</Text>
                <View style={styles.attentionIssues}>
                  {student.issues.map((issue, i) => (
                    <Text key={i} style={styles.attentionIssue}>{issue}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderStudentDetailView = () => {
    if (!selectedStudentDetail || selectedStudentDetail.is_admin) return null;

    const student = selectedStudentDetail;
    const vsClass = student.vs_class || {};

    return (
      <View style={styles.studentDetailContainer}>
        <View style={styles.detailHeader}>
          <View>
            <Text style={styles.detailStudentName}>{student.username}</Text>
            <Text style={styles.detailStudentEmail}>{student.email}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setSelectedStudent(null);
              setSelectedStudentDetail(null);
            }}
            style={styles.closeButton}
          >
            <FeatherIcon name="xmark" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Overall Rank */}
        {student.rankings && (
          <View style={styles.rankSection}>
            <Text style={styles.rankTitle}>Overall Ranking</Text>
            <View style={styles.rankRow}>
              <View style={styles.rankItem}>
                <Text style={styles.rankValue}>#{student.rankings.overall_rank}</Text>
                <Text style={styles.rankLabel}>of {student.rankings.total_students}</Text>
              </View>
              <View style={styles.rankItem}>
                <Text style={styles.rankValue}>{student.rankings.points_percentile}%</Text>
                <Text style={styles.rankLabel}>Points Percentile</Text>
              </View>
              <View style={styles.rankItem}>
                <Text style={styles.rankValue}>{student.rankings.sessions_percentile}%</Text>
                <Text style={styles.rankLabel}>Sessions Percentile</Text>
              </View>
            </View>
            <View style={styles.engagementScoreCard}>
              <Text style={styles.engagementScoreLabel}>Engagement Score</Text>
              <Text style={styles.engagementScoreValue}>{student.engagement_score || 0}</Text>
            </View>
          </View>
        )}

        {/* Comparison with Class */}
        <View style={styles.comparisonSection}>
          <Text style={styles.comparisonTitle}>Comparison with Class Average</Text>
          
          {vsClass.sessions && (
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>Sessions:</Text>
              <View style={styles.comparisonValues}>
                <Text style={styles.comparisonValue}>{vsClass.sessions.value}</Text>
                <Text style={styles.comparisonAvg}>Avg: {vsClass.sessions.avg}</Text>
                <Text style={[
                  styles.comparisonDiff,
                  vsClass.sessions.status === 'above' ? styles.aboveAvg : styles.belowAvg
                ]}>
                  {vsClass.sessions.diff > 0 ? '+' : ''}{vsClass.sessions.diff} ({vsClass.sessions.percent_diff > 0 ? '+' : ''}{vsClass.sessions.percent_diff}%)
                </Text>
              </View>
            </View>
          )}

          {vsClass.active_hours && (
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>Active Hours:</Text>
              <View style={styles.comparisonValues}>
                <Text style={styles.comparisonValue}>{vsClass.active_hours.value}h</Text>
                <Text style={styles.comparisonAvg}>Avg: {vsClass.active_hours.avg}h</Text>
                <Text style={[
                  styles.comparisonDiff,
                  vsClass.active_hours.status === 'above' ? styles.aboveAvg : styles.belowAvg
                ]}>
                  {vsClass.active_hours.diff > 0 ? '+' : ''}{vsClass.active_hours.diff}h ({vsClass.active_hours.percent_diff > 0 ? '+' : ''}{vsClass.active_hours.percent_diff}%)
                </Text>
              </View>
            </View>
          )}

          {vsClass.points && (
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>Points:</Text>
              <View style={styles.comparisonValues}>
                <Text style={styles.comparisonValue}>{vsClass.points.value}</Text>
                <Text style={styles.comparisonAvg}>Avg: {vsClass.points.avg}</Text>
                <Text style={[
                  styles.comparisonDiff,
                  vsClass.points.status === 'above' ? styles.aboveAvg : styles.belowAvg
                ]}>
                  {vsClass.points.diff > 0 ? '+' : ''}{vsClass.points.diff} ({vsClass.points.percent_diff > 0 ? '+' : ''}{vsClass.points.percent_diff}%)
                </Text>
              </View>
            </View>
          )}

          {vsClass.posts && (
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>Posts:</Text>
              <View style={styles.comparisonValues}>
                <Text style={styles.comparisonValue}>{vsClass.posts.value}</Text>
                <Text style={styles.comparisonAvg}>Avg: {vsClass.posts.avg}</Text>
                <Text style={[
                  styles.comparisonDiff,
                  vsClass.posts.status === 'above' ? styles.aboveAvg : styles.belowAvg
                ]}>
                  {vsClass.posts.diff > 0 ? '+' : ''}{vsClass.posts.diff} ({vsClass.posts.percent_diff > 0 ? '+' : ''}{vsClass.posts.percent_diff}%)
                </Text>
              </View>
            </View>
          )}

          {vsClass.comments && (
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>Comments:</Text>
              <View style={styles.comparisonValues}>
                <Text style={styles.comparisonValue}>{vsClass.comments.value}</Text>
                <Text style={styles.comparisonAvg}>Avg: {vsClass.comments.avg}</Text>
                <Text style={[
                  styles.comparisonDiff,
                  vsClass.comments.status === 'above' ? styles.aboveAvg : styles.belowAvg
                ]}>
                  {vsClass.comments.diff > 0 ? '+' : ''}{vsClass.comments.diff} ({vsClass.comments.percent_diff > 0 ? '+' : ''}{vsClass.comments.percent_diff}%)
                </Text>
              </View>
            </View>
          )}

          {vsClass.messages && (
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>Messages:</Text>
              <View style={styles.comparisonValues}>
                <Text style={styles.comparisonValue}>{vsClass.messages.value}</Text>
                <Text style={styles.comparisonAvg}>Avg: {vsClass.messages.avg}</Text>
                <Text style={[
                  styles.comparisonDiff,
                  vsClass.messages.status === 'above' ? styles.aboveAvg : styles.belowAvg
                ]}>
                  {vsClass.messages.diff > 0 ? '+' : ''}{vsClass.messages.diff} ({vsClass.messages.percent_diff > 0 ? '+' : ''}{vsClass.messages.percent_diff}%)
                </Text>
              </View>
            </View>
          )}

          {vsClass.pages_viewed && (
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>Pages Viewed:</Text>
              <View style={styles.comparisonValues}>
                <Text style={styles.comparisonValue}>{vsClass.pages_viewed.value}</Text>
                <Text style={styles.comparisonAvg}>Avg: {vsClass.pages_viewed.avg}</Text>
                <Text style={[
                  styles.comparisonDiff,
                  vsClass.pages_viewed.status === 'above' ? styles.aboveAvg : styles.belowAvg
                ]}>
                  {vsClass.pages_viewed.diff > 0 ? '+' : ''}{vsClass.pages_viewed.diff} ({vsClass.pages_viewed.percent_diff > 0 ? '+' : ''}{vsClass.pages_viewed.percent_diff}%)
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Detailed Session Analytics */}
        <View style={styles.detailedSection}>
          <Text style={styles.detailedSectionTitle}>Detailed Session Analytics</Text>
          
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailItemLabel}>Total Sessions</Text>
              <Text style={styles.detailItemValue}>{student.session_analytics?.total_sessions || 0}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailItemLabel}>Total Active Time</Text>
              <Text style={styles.detailItemValue}>{student.session_analytics?.total_active_hours || 0}h</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailItemLabel}>Avg Session Duration</Text>
              <Text style={styles.detailItemValue}>
                {formatTime(student.session_analytics?.avg_session_duration_seconds || 0)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailItemLabel}>Pages Viewed</Text>
              <Text style={styles.detailItemValue}>{student.session_analytics?.total_pages_viewed || 0}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailItemLabel}>Posts Viewed</Text>
              <Text style={styles.detailItemValue}>{student.session_analytics?.total_posts_viewed || 0}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailItemLabel}>Total Actions</Text>
              <Text style={styles.detailItemValue}>{student.session_analytics?.total_actions || 0}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailItemLabel}>Total Errors</Text>
              <Text style={styles.detailItemValue}>{student.session_analytics?.total_errors || 0}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailItemLabel}>Last Active</Text>
              <Text style={styles.detailItemValue}>
                {student.session_analytics?.last_active_at 
                  ? new Date(student.session_analytics.last_active_at).toLocaleDateString()
                  : 'Never'}
              </Text>
            </View>
          </View>

          {/* Device Breakdown */}
          {student.session_analytics?.device_breakdown && (
            <View style={styles.breakdownSection}>
              <Text style={styles.breakdownTitle}>Device Usage</Text>
              {Object.entries(student.session_analytics.device_breakdown).map(([device, count]) => (
                <View key={device} style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{device.charAt(0).toUpperCase() + device.slice(1)}</Text>
                  <View style={styles.breakdownBarContainer}>
                    <View style={[
                      styles.breakdownBar,
                      { width: `${(count / student.session_analytics.recent_sessions_count) * 100}%` }
                    ]} />
                  </View>
                  <Text style={styles.breakdownValue}>{count} sessions</Text>
                </View>
              ))}
            </View>
          )}

          {/* Platform Breakdown */}
          {student.session_analytics?.platform_breakdown && (
            <View style={styles.breakdownSection}>
              <Text style={styles.breakdownTitle}>Platform Usage</Text>
              {Object.entries(student.session_analytics.platform_breakdown).map(([platform, count]) => (
                <View key={platform} style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Text>
                  <View style={styles.breakdownBarContainer}>
                    <View style={[
                      styles.breakdownBar,
                      { width: `${(count / student.session_analytics.recent_sessions_count) * 100}%` }
                    ]} />
                  </View>
                  <Text style={styles.breakdownValue}>{count} sessions</Text>
                </View>
              ))}
            </View>
          )}

          {/* Recent Sessions */}
          {student.recent_sessions && student.recent_sessions.length > 0 && (
            <View style={styles.recentSessionsSection}>
              <Text style={styles.recentSessionsTitle}>Recent Sessions ({student.recent_sessions.length})</Text>
              <ScrollView style={styles.recentSessionsList} nestedScrollEnabled>
                {student.recent_sessions.slice(0, 10).map((session, idx) => (
                  <View key={idx} style={styles.sessionItem}>
                    <View style={styles.sessionItemHeader}>
                      <Text style={styles.sessionDate}>
                        {new Date(session.started_at).toLocaleDateString()}
                      </Text>
                      <Text style={styles.sessionDuration}>
                        {formatTime(session.active_seconds)}
                      </Text>
                    </View>
                    <View style={styles.sessionItemDetails}>
                      <Text style={styles.sessionDetail}>
                        {session.device_type} • {session.platform}
                      </Text>
                      <Text style={styles.sessionDetail}>
                        {session.pages_viewed} pages • {session.posts_viewed} posts
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderStudentCard = ({ item }) => {
    if (item.is_admin) return null; // Skip admins in student list

    return (
      <TouchableOpacity
        style={styles.studentCard}
        onPress={() => {
          const newSelected = selectedStudent === item.user_id ? null : item.user_id;
          setSelectedStudent(newSelected);
          if (newSelected) {
            setSelectedStudentDetail(item);
          } else {
            setSelectedStudentDetail(null);
          }
        }}
      >
        <View style={styles.studentHeader}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{item.username}</Text>
            <Text style={styles.studentEmail}>{item.email}</Text>
          </View>
          <FeatherIcon
            name={selectedStudent === item.user_id ? "chevron-up" : "chevron-down"}
            size={16}
            color="#616161"
          />
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{item.session_analytics?.total_sessions || 0}</Text>
            <Text style={styles.metricLabel}>Sessions</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>
              {item.session_analytics?.total_active_hours || 0}h
            </Text>
            <Text style={styles.metricLabel}>Active Time</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{item.participation?.total_posts || 0}</Text>
            <Text style={styles.metricLabel}>Posts</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{item.participation?.total_points || 0}</Text>
            <Text style={styles.metricLabel}>Points</Text>
          </View>
        </View>

        {selectedStudent === item.user_id && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pages Viewed:</Text>
              <Text style={styles.detailValue}>
                {item.session_analytics?.total_pages_viewed || 0}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Posts Viewed:</Text>
              <Text style={styles.detailValue}>
                {item.session_analytics?.total_posts_viewed || 0}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Avg Session:</Text>
              <Text style={styles.detailValue}>
                {formatTime(item.session_analytics?.avg_session_duration_seconds || 0)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Comments:</Text>
              <Text style={styles.detailValue}>
                {item.participation?.total_comments || 0}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Messages:</Text>
              <Text style={styles.detailValue}>
                {item.participation?.total_messages || 0}
              </Text>
            </View>
            {item.session_analytics?.device_breakdown && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Primary Device:</Text>
                <Text style={styles.detailValue}>
                  {Object.keys(item.session_analytics.device_breakdown)
                    .sort((a, b) => 
                      item.session_analytics.device_breakdown[b] - 
                      item.session_analytics.device_breakdown[a]
                    )[0] || "Unknown"}
                </Text>
              </View>
            )}
            {item.session_analytics?.last_active_at && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Last Active:</Text>
                <Text style={styles.detailValue}>
                  {new Date(item.session_analytics.last_active_at).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const maxUsernameWidth = React.useMemo(
    () =>
      Math.max(120, ...members.map((member) => member.username.length * 10)),
    [members]
  );
  const maxEmailWidth = React.useMemo(
    () => Math.max(120, ...members.map((member) => member.email.length * 10)),
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
        <View style={{ padding: 15 }}>
          <AnalyticsDatePicker
            onSubmit={(startDate, endDate) => {
              getWeeklyGroupInfo(startDate, endDate);
              if (isAdmin) {
                getDeepAnalytics(startDate, endDate);
              }
            }}
            members={members}
            weekColumns={weekColumns}
          />
        </View>

        {/* Deep Analytics Section - Only for Admins */}
        {isAdmin && (
          <View style={styles.deepAnalyticsSection}>
            <View style={styles.sectionHeader}>
              <FeatherIcon name="chart-line" size={20} color="#2482AA" />
              <Text style={styles.sectionTitle}>Deep Participation Analysis</Text>
            </View>

            {loadingDeep ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2482AA" />
                <Text style={styles.loadingText}>Analyzing student participation...</Text>
              </View>
            ) : showDeepAnalytics && deepAnalytics ? (
              <>
                {renderClassStatistics()}
                
                {/* Student Detail View (Modal/Expanded) */}
                {selectedStudentDetail && (
                  <ScrollView style={styles.studentDetailScroll}>
                    {renderStudentDetailView()}
                  </ScrollView>
                )}

                {/* Student List */}
                {!selectedStudentDetail && (
                  <View style={styles.studentsList}>
                    <Text style={styles.studentsListTitle}>Student List - Tap to View Details</Text>
                    <FlatList
                      data={deepAnalytics}
                      renderItem={renderStudentCard}
                      keyExtractor={(item) => item.user_id.toString()}
                      scrollEnabled={false}
                    />
                  </View>
                )}
              </>
            ) : (
              <View style={styles.emptyState}>
                <FeatherIcon name="chart-bar" size={40} color="#C6C6C6" />
                <Text style={styles.emptyStateText}>
                  Select a date range and click "Get Analytics" to view deep participation insights
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Standard Analytics Table */}
        <View style={styles.standardAnalyticsSection}>
          <View style={styles.sectionHeader}>
            <FeatherIcon name="table" size={20} color="#2482AA" />
            <Text style={styles.sectionTitle}>Weekly Participation Overview</Text>
          </View>

          <ScrollView horizontal>
            <View>
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
        </View>
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
  deepAnalyticsSection: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  standardAnalyticsSection: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#2482AA",
  },
  insightsContainer: {
    backgroundColor: "#F0F8FF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2482AA",
  },
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  insightsTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#2482AA",
  },
  insightSection: {
    marginBottom: 15,
  },
  insightLabel: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 6,
  },
  insightText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },
  insightItem: {
    marginBottom: 8,
  },
  insightItemTitle: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 2,
  },
  insightItemText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 12,
    lineHeight: 18,
  },
  studentsList: {
    marginTop: 10,
  },
  studentsListTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 12,
  },
  studentCard: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  studentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 12,
    color: "#666",
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  metric: {
    alignItems: "center",
  },
  metricValue: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#2482AA",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: "#666",
  },
  detailsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: "#666",
  },
  detailValue: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
  // Class Statistics Styles
  classStatsContainer: {
    backgroundColor: "#F0F8FF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2482AA",
  },
  classStatsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },
  classStatsTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#2482AA",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statCard: {
    width: "30%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  statValue: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: "#2482AA",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },
  topPerformerCard: {
    backgroundColor: "#FFF9E6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  topPerformerLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  topPerformerName: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 4,
  },
  topPerformerScore: {
    fontSize: 13,
    color: "#666",
  },
  attentionCard: {
    backgroundColor: "#FFF5F5",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  attentionLabel: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#D32F2F",
    marginBottom: 10,
  },
  attentionItem: {
    marginBottom: 8,
  },
  attentionName: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 4,
  },
  attentionIssues: {
    marginLeft: 12,
  },
  attentionIssue: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  // Student Detail View Styles
  studentDetailScroll: {
    maxHeight: Dimensions.get("window").height * 0.7,
  },
  studentDetailContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#2482AA",
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#E0E0E0",
  },
  detailStudentName: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: "#2482AA",
    marginBottom: 4,
  },
  detailStudentEmail: {
    fontSize: 14,
    color: "#666",
  },
  closeButton: {
    padding: 8,
  },
  // Ranking Styles
  rankSection: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  rankTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 12,
  },
  rankRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  rankItem: {
    alignItems: "center",
  },
  rankValue: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: "#2482AA",
    marginBottom: 4,
  },
  rankLabel: {
    fontSize: 11,
    color: "#666",
  },
  engagementScoreCard: {
    backgroundColor: "#2482AA",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  engagementScoreLabel: {
    fontSize: 12,
    color: "#fff",
    marginBottom: 4,
  },
  engagementScoreValue: {
    fontSize: 32,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },
  // Comparison Styles
  comparisonSection: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  comparisonTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 15,
  },
  comparisonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  comparisonLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  comparisonValues: {
    flex: 2,
    alignItems: "flex-end",
  },
  comparisonValue: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  comparisonAvg: {
    fontSize: 12,
    color: "#999",
  },
  comparisonDiff: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    marginTop: 2,
  },
  aboveAvg: {
    color: "#4CAF50",
  },
  belowAvg: {
    color: "#F44336",
  },
  // Detailed Section Styles
  detailedSection: {
    marginTop: 20,
  },
  detailedSectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 15,
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  detailItem: {
    width: "48%",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  detailItemLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  detailItemValue: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  // Breakdown Styles
  breakdownSection: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  breakdownTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  breakdownLabel: {
    fontSize: 13,
    color: "#666",
    width: 80,
  },
  breakdownBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  breakdownBar: {
    height: "100%",
    backgroundColor: "#2482AA",
    borderRadius: 10,
  },
  breakdownValue: {
    fontSize: 12,
    color: "#666",
    width: 70,
    textAlign: "right",
  },
  // Recent Sessions Styles
  recentSessionsSection: {
    marginTop: 20,
  },
  recentSessionsTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 12,
  },
  recentSessionsList: {
    maxHeight: 300,
  },
  sessionItem: {
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#2482AA",
  },
  sessionItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sessionDate: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  sessionDuration: {
    fontSize: 13,
    color: "#2482AA",
  },
  sessionItemDetails: {
    marginTop: 4,
  },
  sessionDetail: {
    fontSize: 11,
    color: "#666",
    marginBottom: 2,
  },
});
