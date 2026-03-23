import * as React from "react";
import { API_URL } from "../../config";
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
  const [deepAnalytics, setDeepAnalytics] = React.useState([]);
  const [classStats, setClassStats] = React.useState(null);
  const [postHealth, setPostHealth] = React.useState({ hot: [], unanswered: [] });
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingDeep, setLoadingDeep] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [showDeepAnalytics, setShowDeepAnalytics] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [selectedStudentDetail, setSelectedStudentDetail] = React.useState(null);
  const [selectedWeek, setSelectedWeek] = React.useState("total");
  const [deepTimeWindow, setDeepTimeWindow] = React.useState("all"); // 'all', 'week_n', 'custom'
  const [availableWeeks, setAvailableWeeks] = React.useState([]);
  const [sortBy, setSortBy] = React.useState("engagement_score"); 
  const [sortOrder, setSortOrder] = React.useState("desc"); // 'asc', 'desc'
  const [page, setPage] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pageSize] = React.useState(20);
  const [currentDateRange, setCurrentDateRange] = React.useState({ start: null, end: null });
  const isFocused = useIsFocused();

  // Check if user is admin
  React.useEffect(() => {
    const checkAdmin = async () => {
      calculateAvailableWeeks(); // Initialize weeks
      const token =
        Platform.OS !== "web"
          ? await SecureStore.getItemAsync("token")
          : sessionStorage.getItem("token");

      try {
        const response = await fetch(
          `${API_URL}/groups/isadmin`,
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
        const isAdminResult = String(data.isAdmin) === "true";
        setIsAdmin(isAdminResult);
        
        // Auto-fetch "All Time" deep analytics on first load if admin
        if (isAdminResult && !showDeepAnalytics && !loadingDeep) {
          // Manual dates for 'all time' on init
          const now = new Date();
          const start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString();
          const end = now.toISOString();
          fetchDeepData(start, end, 0, sortBy, sortOrder, false);
          getPostHealthAnalytics(start, end);
        }
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
        `${API_URL}/analytics/admin/groups/${user.currentGroup}/trends/weekly`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
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

  // Helper to fetch deep analytics
  const fetchDeepData = async (startDate, endDate, targetPage, targetSortBy, targetSortOrder, isAppend = false) => {
    if (!isAdmin) return;

    if (isAppend) setLoadingMore(true);
    else setLoadingDeep(true);

    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/analytics/admin/groups/${user.currentGroup}/participation/deep`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            startDate,
            endDate,
            sortBy: targetSortBy,
            sortOrder: targetSortOrder,
            limit: pageSize,
            offset: targetPage * pageSize,
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
      
      if (isAppend) {
        setDeepAnalytics(prev => [...prev, ...(jsonData.analytics || [])]);
      } else {
        setDeepAnalytics(jsonData.analytics || []);
        setClassStats(jsonData.class_statistics || null);
      }
      
      setTotalCount(jsonData.pagination?.total || 0);
      setShowDeepAnalytics(true);
      setCurrentDateRange({ start: startDate, end: endDate });
      
    } catch (err) {
      console.error("Failed to fetch deep analytics:", err);
      alert("Failed to load deep analytics. Please try again.");
    } finally {
      setLoadingDeep(false);
      setLoadingMore(false);
    }
  };

  const getDeepAnalytics = async (startDate, endDate) => {
    setPage(0);
    // Use the explicit dates provided (e.g. from Custom Picker)
    await fetchDeepData(startDate, endDate, 0, sortBy, sortOrder, false);
    // Also update post health
    getPostHealthAnalytics(startDate, endDate);
  };

  // Helper to generate weeks based on group creation or current year
  const calculateAvailableWeeks = () => {
    // For now, generate the last 12 weeks for the user to pick
    const weeks = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1)); // Mon
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Sun
      
      weeks.unshift({
        id: `week_${12-i}`,
        label: `Week ${12-i}`,
        start: startOfWeek.toISOString().split('T')[0],
        end: endOfWeek.toISOString().split('T')[0]
      });
    }
    setAvailableWeeks(weeks);
  };

  const handleTimeTabChange = (tabId, startStr, endStr) => {
    setDeepTimeWindow(tabId);
    setPage(0);
    
    let start, end;
    const now = new Date();
    
    if (tabId === 'all') {
      start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString();
      end = now.toISOString();
    } else if (tabId === 'custom') {
      if (startStr && endStr) {
        start = startStr;
        end = endStr;
      } else {
        return; // Wait for picker
      }
    } else if (tabId.startsWith('week_')) {
      const week = availableWeeks.find(w => w.id === tabId);
      start = week.start;
      end = week.end;
    }
    
    fetchDeepData(start, end, 0, sortBy, sortOrder, false);
    getPostHealthAnalytics(start, end);
  };

  const loadMoreStudents = async () => {
    const nextPage = page + 1;
    if (nextPage * pageSize >= totalCount) return;
    
    setPage(nextPage);
    await fetchDeepData(currentDateRange.start, currentDateRange.end, nextPage, sortBy, sortOrder, true);
  };

  // Re-fetch when sorting changes
  React.useEffect(() => {
    if (showDeepAnalytics && currentDateRange.start) {
      getDeepAnalytics(currentDateRange.start, currentDateRange.end);
    }
  }, [sortBy, sortOrder]);

  const getPostHealthAnalytics = async (startDate, endDate) => {
    // ... logic remains same ...
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
    setDeepAnalytics([]);
    setClassStats(null);
    setShowDeepAnalytics(false);
    setSelectedStudent(null);
    setSelectedStudentDetail(null);
    setPage(0);
    setTotalCount(0);
    setCurrentDateRange({ start: null, end: null });
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
          <Text style={styles.classStatsTitle}>Class Overview</Text>
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
            <Text style={styles.statLabel}>Avg Replies</Text>
          </View>
        </View>

        {/* Top 10 Performers Section */}
        {classStats.top_students && classStats.top_students.length > 0 && (
          <View style={styles.specialListSection}>
            <View style={styles.specialListHeader}>
              <Text style={styles.specialListTitle}>🏆 Top 10 Performers</Text>
            </View>
            {classStats.top_students.map((student) => (
              <React.Fragment key={`top-${student.user_id}`}>
                {renderStudentCard({ item: student })}
              </React.Fragment>
            ))}
          </View>
        )}

        {/* Students Needing Attention Section */}
        {classStats.needs_attention && classStats.needs_attention.length > 0 && (
          <View style={styles.specialListSection}>
            <View style={styles.specialListHeader}>
              <Text style={[styles.specialListTitle, { color: '#D32F2F' }]}>⚠️ Students Needing Attention</Text>
            </View>
            {classStats.needs_attention.map((student) => (
              <View key={`attn-${student.user_id}`} style={styles.attentionWrapper}>
                {renderStudentCard({ item: student })}
                <View style={styles.attentionIssueList}>
                  {student.issues?.map((issue, idx) => (
                    <Text key={idx} style={styles.attentionIssueText}>• {issue}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderPostHealth = () => {
    if (!showDeepAnalytics) return null;

    return (
      <View style={styles.postHealthContainer}>
        <View style={styles.postHealthHeader}>
          <FeatherIcon name="fire" size={20} color="#FF5722" />
          <Text style={styles.postHealthTitle}>Content Health & Hot Posts</Text>
        </View>

        <View style={styles.postHealthRow}>
          {/* Unanswered Posts */}
          <View style={styles.postHealthColumn}>
            <Text style={styles.postHealthSubTitle}>⚠️ Unanswered (>24h)</Text>
            {postHealth.unanswered.length > 0 ? (
              postHealth.unanswered.map((post) => (
                <View key={post.postId} style={styles.smallPostCard}>
                  <Text style={styles.smallPostTitle} numberOfLines={1}>{post.title}</Text>
                  <Text style={styles.smallPostMeta}>{new Date(post.createdAt).toLocaleDateString()}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>All caught up!</Text>
            )}
          </View>

          {/* Hot Posts */}
          <View style={styles.postHealthColumn}>
            <Text style={styles.postHealthSubTitle}>🔥 Hot Discussions</Text>
            {postHealth.hot.length > 0 ? (
              postHealth.hot.map((post) => (
                <View key={post.postId} style={styles.smallPostCard}>
                  <Text style={styles.smallPostTitle} numberOfLines={1}>{post.title}</Text>
                  <View style={styles.hotMetrics}>
                    <Text style={styles.smallPostMeta}>{post.replyCount} replies</Text>
                    <Text style={styles.smallPostMeta}> • {post.viewCount} views</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>Quiet day...</Text>
            )}
          </View>
        </View>
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
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>{item.engagement_score || 0}</Text>
            <Text style={styles.scoreBadgeLabel}>Score</Text>
          </View>
          <FeatherIcon
            name={selectedStudent === item.user_id ? "chevron-up" : "chevron-down"}
            size={16}
            color="#616161"
            style={{ marginLeft: 10 }}
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

  const renderItem = ({ item }) => {
    const data = selectedWeek === "total" ? item.total : (item[selectedWeek] || { points: 0, posts: 0, comments: 0, messages: 0 });
    
    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", marginVertical: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' }}
      >
        <View
          style={{ width: maxUsernameWidth, marginHorizontal: columnSpacing }}
        >
          <Text style={{ fontSize: 14, fontWeight: '500' }}>{item.username}</Text>
        </View>
        <View style={{ width: maxEmailWidth, marginHorizontal: columnSpacing }}>
          <Text style={{ fontSize: 12, color: '#666' }}>{item.email}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: totalColumnWidth,
            justifyContent: "space-evenly",
            marginHorizontal: columnSpacing,
          }}
        >
          <Text style={{ fontSize: 14, width: labelWidth, textAlign: 'center' }}>
            {data.points}
          </Text>
          <Text style={{ fontSize: 14, width: labelWidth, textAlign: 'center' }}>
            {data.posts}
          </Text>
          <Text style={{ fontSize: 14, width: labelWidth, textAlign: 'center' }}>
            {data.comments || data.replies || 0}
          </Text>
          <Text style={{ fontSize: 14, width: labelWidth, textAlign: 'center' }}>
            {data.messages || data.chats || 0}
          </Text>
        </View>
      </View>
    );
  };

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

      <View style={styles.mainContainer}>
        {/* Deep Analytics Section - Now Full Width and Hero Module */}
        {isAdmin && (
          <View style={styles.deepAnalyticsFullWidth}>
            <View style={styles.sectionHeaderHero}>
              <FeatherIcon name="chart-simple" size={24} color="#2482AA" />
              <Text style={styles.sectionTitleHero}>Student Deep Participation Analytics</Text>
            </View>

            {/* NEW: Scrollable Week & Mode Tab Bar (Matching Weekly Trend Style) */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deepTimeTabsScroll}>
              <TouchableOpacity 
                onPress={() => handleTimeTabChange('all')}
                style={[styles.deepTimeTabItem, deepTimeWindow === 'all' && styles.activeDeepTimeTabItem]}
              >
                <FeatherIcon name="infinity" size={12} color={deepTimeWindow === 'all' ? "#fff" : "#666"} style={{ marginRight: 6 }} />
                <Text style={[styles.deepTimeTabTextItem, deepTimeWindow === 'all' && styles.activeDeepTimeTabTextItem]}>All Time</Text>
              </TouchableOpacity>
              
              {availableWeeks.map((week) => (
                <TouchableOpacity 
                  key={week.id}
                  onPress={() => handleTimeTabChange(week.id)}
                  style={[styles.deepTimeTabItem, deepTimeWindow === week.id && styles.activeDeepTimeTabItem]}
                >
                  <Text style={[styles.deepTimeTabTextItem, deepTimeWindow === week.id && styles.activeDeepTimeTabTextItem]}>
                    {week.label}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity 
                onPress={() => setDeepTimeWindow('custom')}
                style={[styles.deepTimeTabItem, deepTimeWindow === 'custom' && styles.activeDeepTimeTabItem]}
              >
                <FeatherIcon name="calendar-days" size={12} color={deepTimeWindow === 'custom' ? "#fff" : "#666"} style={{ marginRight: 6 }} />
                <Text style={[styles.deepTimeTabTextItem, deepTimeWindow === 'custom' && styles.activeDeepTimeTabTextItem]}>Custom</Text>
              </TouchableOpacity>
            </ScrollView>

            {deepTimeWindow === 'custom' && (
              <View style={styles.customPickerWrapper}>
                <AnalyticsDatePicker
                  onSubmit={(startDate, endDate) => {
                    handleTimeTabChange('custom', startDate, endDate);
                  }}
                  members={members}
                  weekColumns={weekColumns}
                />
              </View>
            )}

            <View style={styles.contentWrapper}>
              {loadingDeep ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#2482AA" />
                  <Text style={styles.loadingText}>Synthesizing student data...</Text>
                </View>
              ) : showDeepAnalytics && deepAnalytics ? (
                <>
                  {renderClassStatistics()}
                  
                  {renderPostHealth()}

                  {/* Student Detail View */}
                  {selectedStudentDetail && (
                    <ScrollView style={styles.studentDetailScroll}>
                      {renderStudentDetailView()}
                    </ScrollView>
                  )}

                  {/* Student List */}
                  {!selectedStudentDetail && (
                    <View style={styles.studentsList}>
                      <View style={styles.sortControlsHeader}>
                        <View>
                          <Text style={styles.studentsListTitle}>Student Ranking</Text>
                          <Text style={styles.studentListSub}>{totalCount} Students Tracked</Text>
                        </View>
                        <TouchableOpacity 
                          onPress={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                          style={styles.orderToggle}
                        >
                          <FeatherIcon 
                            name={sortOrder === 'desc' ? "arrow-down-9-1" : "arrow-up-1-9"} 
                            size={14} 
                            color="#2482AA" 
                          />
                          <Text style={styles.orderToggleText}>{sortOrder === 'desc' ? "High to Low" : "Low to High"}</Text>
                        </TouchableOpacity>
                      </View>

                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortTabs}>
                        {[
                          { id: 'engagement_score', label: 'Overall Score', icon: 'bolt' },
                          { id: 'points', label: 'Points', icon: 'star' },
                          { id: 'posts', label: 'Posts', icon: 'pen-to-square' },
                          { id: 'active_time', label: 'Active Time', icon: 'clock' },
                          { id: 'sessions', label: 'Sessions', icon: 'right-to-bracket' },
                        ].map((tab) => (
                          <TouchableOpacity 
                            key={tab.id}
                            onPress={() => setSortBy(tab.id)}
                            style={[styles.sortTab, sortBy === tab.id && styles.activeSortTab]}
                          >
                            <FeatherIcon name={tab.icon} size={12} color={sortBy === tab.id ? "#fff" : "#666"} style={{ marginRight: 6 }} />
                            <Text style={[styles.sortTabText, sortBy === tab.id && styles.activeSortTabText]}>{tab.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>

                      <FlatList
                        data={deepAnalytics}
                        renderItem={renderStudentCard}
                        keyExtractor={(item) => item.user_id.toString()}
                        scrollEnabled={false}
                      />

                      {deepAnalytics.length < totalCount && (
                        <TouchableOpacity 
                          onPress={loadMoreStudents}
                          disabled={loadingMore}
                          style={styles.loadMoreButton}
                        >
                          {loadingMore ? (
                            <ActivityIndicator size="small" color="#2482AA" />
                          ) : (
                            <Text style={styles.loadMoreText}>Load More Students ({deepAnalytics.length} / {totalCount})</Text>
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.emptyState}>
                  <FeatherIcon name="chart-bar" size={40} color="#C6C6C6" />
                  <Text style={styles.emptyStateText}>
                    Ready to analyze group participation metrics.
                  </Text>
                </View>
              )}
            </View>
          </View>
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
  specialListSection: {
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  specialListHeader: {
    marginBottom: 15,
  },
  specialListTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#2482AA",
  },
  attentionWrapper: {
    marginBottom: 15,
  },
  attentionIssueList: {
    backgroundColor: "#FFF5F5",
    padding: 10,
    marginTop: -15, // Negative margin to connect with card above
    marginBottom: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#FF6B6B",
  },
  attentionIssueText: {
    fontSize: 11,
    color: "#D32F2F",
    fontStyle: "italic",
    marginBottom: 2,
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
  weekTabs: {
    flexDirection: "row",
    marginBottom: 20,
    paddingBottom: 5,
  },
  weekTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  activeWeekTab: {
    backgroundColor: "#2482AA",
    borderColor: "#2482AA",
  },
  weekTabText: {
    fontSize: 13,
    color: "#666",
    fontFamily: "Poppins_600SemiBold",
  },
  activeWeekTabText: {
    color: "#fff",
  },
  modernStudentCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  modernCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  modernStudentName: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  modernStudentEmail: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  modernBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modernBadgeText: {
    fontSize: 10,
    color: "#2196F3",
    fontWeight: "bold",
  },
  mainContainer: {
    backgroundColor: "#fbfbfb",
  },
  deepAnalyticsFullWidth: {
    backgroundColor: "#fff",
    minHeight: Dimensions.get("window").height,
  },
  sectionHeaderHero: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionTitleHero: {
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
    color: "#2482AA",
  },
  deepTimeTabsScroll: {
    paddingHorizontal: 15,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  deepTimeTabItem: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "#F0F3F5",
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  activeDeepTimeTabItem: {
    backgroundColor: "#2482AA",
  },
  deepTimeTabTextItem: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    color: "#666",
  },
  activeDeepTimeTabTextItem: {
    color: "#fff",
  },
  customPickerWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  contentWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  studentListSub: {
    fontSize: 12,
    color: "#999",
    marginTop: -8,
    marginBottom: 10,
  },
  modernMetricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FBFBFB",
    padding: 12,
    borderRadius: 8,
  },
  modernMetric: {
    alignItems: "center",
    flex: 1,
  },
  modernMetricValue: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#2482AA",
  },
  modernMetricLabel: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
    textTransform: "uppercase",
  },
  scoreBadge: {
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2482AA",
    minWidth: 50,
  },
  scoreBadgeText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#2482AA",
  },
  scoreBadgeLabel: {
    fontSize: 8,
    color: "#2482AA",
    textTransform: "uppercase",
  },
  postHealthContainer: {
    backgroundColor: "#FFF8F2",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF5722",
  },
  postHealthHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },
  postHealthTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#E64A19",
  },
  postHealthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postHealthColumn: {
    width: "48%",
  },
  postHealthSubTitle: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    color: "#555",
    marginBottom: 10,
  },
  smallPostCard: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#FFE0B2",
  },
  smallPostTitle: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  smallPostMeta: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
  },
  hotMetrics: {
    flexDirection: "row",
  },
  noDataText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  activeDeepTimeTabText: {
    color: "#fff",
  },
  deepTimeTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F5F7F8",
    padding: 6,
    borderRadius: 12,
    marginBottom: 15,
  },
  deepTimeTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeDeepTimeTab: {
    backgroundColor: "#2482AA",
    shadowColor: "#2482AA",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  deepTimeTabText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    color: "#666",
  },
  activeDeepTimeTabText: {
    color: "#fff",
  },
  sortControlsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E1F5FE",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  orderToggleText: {
    fontSize: 11,
    color: "#2482AA",
    fontFamily: "Poppins_600SemiBold",
    marginLeft: 6,
  },
  sortTabs: {
    flexDirection: "row",
    marginBottom: 15,
  },
  sortTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  activeSortTab: {
    backgroundColor: "#2482AA",
    borderColor: "#2482AA",
  },
  sortTabText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Poppins_600SemiBold",
  },
  activeSortTabText: {
    color: "#fff",
  },
  loadMoreButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2482AA",
    borderStyle: "dashed",
  },
  loadMoreText: {
    color: "#2482AA",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
});
