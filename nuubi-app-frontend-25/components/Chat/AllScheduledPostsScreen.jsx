import * as React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

import { API_URL } from "../../config";
import { AccountContext } from "../AccountContext";

function getTimezoneAbbreviation(timezone, dateValue) {
  try {
    const date = dateValue
      ? new Date(
          /^\d{4}-\d{2}-\d{2}$/.test(dateValue) 
          // Use midday to avoid timezone shifts changing the calendar date.
            ? `${dateValue}T12:00:00Z`
            : dateValue
        )
      : new Date();

    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    }).formatToParts(date);

    return (
      parts.find((part) => part.type === "timeZoneName")?.value || timezone
    );
  } catch (error) {
    console.error("Unable to format timezone:", error);
    return timezone;
  }
}

export default function AllScheduledPostsScreen({ navigation, route }) {
  const { user } = React.useContext(AccountContext);

  const groupId = route.params?.groupId || user?.currentGroup;

  const [schedules, setSchedules] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [deletingScheduleId, setDeletingScheduleId] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "All Scheduled Posts",
    });
  }, [navigation]);
  // Fetch weekly and one-time schedules.
  const fetchAllSchedules = React.useCallback(
    async (signal) => {
      if (!groupId) {
        setErrorMessage("Missing group id.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage("");

      try {
        const token =
          Platform.OS !== "web"
            ? await SecureStore.getItemAsync("token")
            : sessionStorage.getItem("token");

        if (!token) {
          throw new Error(
            "No authentication token found. Please log in again."
          );
        }
        const weeklyUrl =
          `${API_URL}/groups/${groupId}` + `/weekly-takeaway-schedules`;

        const regularUrl =
          `${API_URL}/groups/${groupId}` + `/scheduled-posts/all`;

        const requestOptions = {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal,
        };

        console.log("Fetch all weekly schedules:", weeklyUrl);
        console.log("Fetch all one-time schedules:", regularUrl);

        // Fetch both schedule types at the same time.
        const [weeklyResponse, regularResponse] = await Promise.all([
          fetch(weeklyUrl, requestOptions),
          fetch(regularUrl, requestOptions),
        ]);

        const [weeklyData, regularData] = await Promise.all([
          weeklyResponse.json(),
          regularResponse.json(),
        ]);

        if (!weeklyResponse.ok) {
          throw new Error(
            weeklyData?.message ||
              weeklyData?.error ||
              `Failed to load weekly schedules: ${weeklyResponse.status}`
          );
        }

        if (!regularResponse.ok) {
          throw new Error(
            regularData?.message ||
              regularData?.error ||
              `Failed to load one-time schedules: ${regularResponse.status}`
          );
        }

        const weeklySchedules = Array.isArray(weeklyData)
          ? weeklyData
          : weeklyData.schedules || [];

        const regularSchedules = Array.isArray(regularData)
          ? regularData
          : regularData.scheduledPosts || [];

        console.log("All weekly schedules:", weeklySchedules);

        console.log("All one-time schedules:", regularSchedules);

        const normalizedWeekly = weeklySchedules.map((schedule) => ({
          ...schedule,

          schedule_key: `weekly-${schedule.id}`,
          schedule_type: "weekly",
          type_label: "Weekly",

          display_date: schedule.start_date || "—",

          display_end_date: schedule.end_date || "—",

          display_day: schedule.day_of_week || "—",

          display_time: schedule.scheduled_time || "—",

          display_status: schedule.is_active ? "Active" : "Inactive",

          sort_date:
            schedule.created_at || schedule.createdAt || schedule.start_date,
        }));

        const normalizedRegular = regularSchedules.map((schedule) => ({
          ...schedule,

          schedule_key: `one-time-${schedule.id}`,
          schedule_type: "one_time",
          type_label: "One-time",

          display_date: schedule.scheduled_date || "—",

          display_end_date: "—",
          display_day: "—",

          display_time: schedule.scheduled_time || "—",

          display_status: schedule.status || "pending",

          sort_date:
            schedule.created_at || schedule.createdAt || schedule.scheduled_at,
        }));

        const combinedSchedules = [...normalizedWeekly, ...normalizedRegular];

        const manageableSchedules = combinedSchedules
          .filter((schedule) => {
            // Only keep active weekly schedules.
            if (schedule.schedule_type === "weekly") {
              return schedule.is_active === true;
            }

            // Hide completed, cancelled, and failed one-time schedules.
            const normalizedStatus = String(
              schedule.status || ""
            ).toLowerCase();

            return !["published", "cancelled", "canceled", "failed"].includes(
              normalizedStatus
            );
          })
          .sort((first, second) => {
            const firstTime = new Date(first.sort_date || 0).getTime();

            const secondTime = new Date(second.sort_date || 0).getTime();

            return secondTime - firstTime;
          });

        console.log("Combined all schedules:", combinedSchedules);

        console.log("Manageable schedules:", manageableSchedules);

        setSchedules(manageableSchedules);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load all scheduled posts:", error);

          setErrorMessage(error.message || "Unable to load scheduled posts.");
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [groupId]
  );

  const deleteSchedule = React.useCallback(
    async (schedule) => {
      if (!groupId || !schedule?.id) {
        return;
      }

      const scheduleKey =
        schedule.schedule_key ||
        `${schedule.schedule_type === "weekly" ? "weekly" : "one-time"}-${
          schedule.id
        }`;

      setDeletingScheduleId(scheduleKey);

      try {
        const token =
          Platform.OS !== "web"
            ? await SecureStore.getItemAsync("token")
            : sessionStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found.");
        }

        const isWeekly = schedule.schedule_type === "weekly";

        const url = isWeekly
          ? `${API_URL}/groups/${groupId}` +
            `/weekly-takeaway-schedules/` +
            `${schedule.id}/deactivate`
          : `${API_URL}/groups/${groupId}` +
            `/scheduled-posts/` +
            `${schedule.id}/cancel`;

        const response = await fetch(url, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              data?.message ||
              `Failed to delete schedule: ${response.status}`
          );
        }

        console.log("Schedule deactivated or cancelled:", data);

        setSchedules((currentSchedules) =>
          currentSchedules.filter(
            (currentSchedule) => currentSchedule.schedule_key !== scheduleKey
          )
        );
      } catch (error) {
        console.error("Failed to delete schedule:", error);

        if (Platform.OS === "web") {
          window.alert(error.message || "Unable to delete schedule.");
        } else {
          Alert.alert(
            "Delete failed",
            error.message || "Unable to delete schedule."
          );
        }
      } finally {
        setDeletingScheduleId(null);
      }
    },
    [groupId]
  );

  const confirmDeleteSchedule = React.useCallback(
    (schedule) => {
      const message =
        `Delete "${schedule.title}"?\n\n` +
        "This schedule will become inactive and will no longer create posts.";

      if (Platform.OS === "web") {
        const confirmed = window.confirm(message);

        if (confirmed) {
          deleteSchedule(schedule);
        }

        return;
      }

      Alert.alert("Delete scheduled post?", message, [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteSchedule(schedule),
        },
      ]);
    },
    [deleteSchedule]
  );

  useFocusEffect(
    React.useCallback(() => {
      const controller = new AbortController();

      fetchAllSchedules(controller.signal);

      return () => controller.abort();
    }, [fetchAllSchedules])
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading scheduled posts...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  if (schedules.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No scheduled posts found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.pageScroll}
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={{
              color: "#2482AA",
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            ‹ Back
          </Text>
        </TouchableOpacity>

        <Text style={styles.countText}>
          {schedules.length} scheduled{" "}
          {schedules.length === 1 ? "post" : "posts"}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={styles.horizontalContent}
        >
          <View style={styles.table}>
            {/* Table header */}
            <View style={[styles.row, styles.headerRow]}>
              <Text
                style={[styles.headerText, styles.idColumn, styles.centerText]}
              >
                ID
              </Text>

              <Text
                style={[
                  styles.headerText,
                  styles.typeColumn,
                  styles.centerText,
                ]}
              >
                Type
              </Text>

              <Text
                style={[
                  styles.headerText,
                  styles.titleColumn,
                  styles.centerText,
                ]}
              >
                Title
              </Text>

              <Text
                style={[
                  styles.headerText,
                  styles.dateColumn,
                  styles.centerText,
                ]}
              >
                Start / Publish Date
              </Text>

              <Text
                style={[
                  styles.headerText,
                  styles.dateColumn,
                  styles.centerText,
                ]}
              >
                End Date
              </Text>

              <Text
                style={[styles.headerText, styles.dayColumn, styles.centerText]}
              >
                Day
              </Text>

              <Text
                style={[
                  styles.headerText,
                  styles.timeColumn,
                  styles.centerText,
                ]}
              >
                Time
              </Text>

              <Text
                style={[
                  styles.headerText,
                  styles.timezoneColumn,
                  styles.centerText,
                ]}
              >
                Timezone
              </Text>

              <Text
                style={[
                  styles.headerText,
                  styles.statusColumn,
                  styles.centerText,
                ]}
              >
                Status
              </Text>

              <Text
                style={[
                  styles.headerText,
                  styles.actionsColumn,
                  styles.centerText,
                ]}
              >
                Actions
              </Text>
            </View>

            {/* Table rows */}
            {schedules.map((schedule, index) => {
              const isWeekly = schedule.schedule_type === "weekly";

              const statusValue =
                schedule.display_status ||
                (isWeekly
                  ? schedule.is_active
                    ? "Active"
                    : "Inactive"
                  : schedule.status || "Pending");

              const normalizedStatus = String(statusValue).toLowerCase();

              const isActiveStatus = ["active", "pending"].includes(
                normalizedStatus
              );

              const isDeleting = deletingScheduleId === schedule.schedule_key;

              return (
                <View
                  key={schedule.schedule_key}
                  style={[styles.row, index % 2 === 1 && styles.alternateRow]}
                >
                  <Text
                    style={[
                      styles.cellText,
                      styles.idColumn,
                      styles.centerText,
                    ]}
                  >
                    {schedule.id}
                  </Text>

                  {/* Type */}
                  <View style={styles.typeColumn}>
                    <View
                      style={[
                        styles.typeBadge,
                        isWeekly
                          ? styles.weeklyTypeBadge
                          : styles.oneTimeTypeBadge,
                      ]}
                    >
                      <Text style={styles.typeBadgeText}>
                        {schedule.type_label ||
                          (isWeekly ? "Weekly" : "One-time")}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.cellText,
                      styles.titleColumn,
                      styles.centerText,
                    ]}
                  >
                    {schedule.title || "Scheduled Post"}
                  </Text>

                  <Text
                    style={[
                      styles.cellText,
                      styles.dateColumn,
                      styles.centerText,
                    ]}
                  >
                    {schedule.display_date || "—"}
                  </Text>

                  <Text
                    style={[
                      styles.cellText,
                      styles.dateColumn,
                      styles.centerText,
                    ]}
                  >
                    {schedule.display_end_date || "—"}
                  </Text>

                  <Text
                    style={[
                      styles.cellText,
                      styles.dayColumn,
                      styles.centerText,
                    ]}
                  >
                    {schedule.display_day || "—"}
                  </Text>

                  <Text
                    style={[
                      styles.cellText,
                      styles.timeColumn,
                      styles.centerText,
                    ]}
                  >
                    {schedule.display_time || "—"}
                  </Text>

                  <Text
                    style={[
                      styles.cellText,
                      styles.timezoneColumn,
                      styles.centerText,
                    ]}
                  >
                    {getTimezoneAbbreviation(
                      schedule.timezone,
                      schedule.scheduled_at ||
                        schedule.next_scheduled_at ||
                        schedule.display_date
                    )}
                  </Text>

                  {/* Status */}
                  <View style={styles.statusColumn}>
                    <View
                      style={[
                        styles.statusBadge,
                        isActiveStatus
                          ? styles.activeBadge
                          : styles.inactiveBadge,
                      ]}
                    >
                      <Text style={styles.statusText}>{statusValue}</Text>
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={styles.actionsColumn}>
                    <View style={styles.actionsContainer}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.actionButton,
                          styles.editButton,
                          pressed && styles.buttonPressed,
                          !isActiveStatus && styles.disabledButton,
                        ]}
                        onPress={() => {
                          if (isWeekly) {
                            navigation.navigate("CreateWeeklyTakeawayPost", {
                              group_id: groupId,
                              mode: "edit",
                              schedule,
                            });

                            return;
                          }

                          navigation.navigate("CreatePost", {
                            group_id: groupId,
                            mode: "editScheduledPost",
                            scheduledPost: schedule,
                          });
                        }}
                        disabled={!isActiveStatus}
                        accessibilityRole="button"
                        accessibilityLabel={`Edit ${
                          schedule.title || "scheduled post"
                        }`}
                        accessibilityState={{
                          disabled: !isActiveStatus,
                        }}
                      >
                        <Text style={styles.editButtonText}>Edit</Text>
                      </Pressable>

                      <Pressable
                        style={({ pressed }) => [
                          styles.actionButton,
                          styles.deleteButton,
                          pressed && styles.buttonPressed,
                          (isDeleting || !isActiveStatus) &&
                            styles.disabledButton,
                        ]}
                        onPress={() => {
                          confirmDeleteSchedule(schedule);
                        }}
                        disabled={isDeleting || !isActiveStatus}
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${
                          schedule.title || "scheduled post"
                        }`}
                        accessibilityState={{
                          disabled: isDeleting || !isActiveStatus,
                        }}
                      >
                        <Text style={styles.deleteButtonText}>
                          {isDeleting
                            ? "Deleting..."
                            : isActiveStatus
                            ? "Delete"
                            : "Deleted"}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fbfbfb",
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 16,
  },

  countText: {
    marginTop: 4,
    marginBottom: 16,
    fontSize: 14,
    color: "#555555",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },

  errorText: {
    fontSize: 16,
    color: "#a00000",
  },

  emptyText: {
    fontSize: 16,
    color: "#555555",
  },

  pageScroll: {
    flex: 1,
  },

  horizontalContent: {
    paddingBottom: 16,
  },

  table: {
    minWidth: 1400,
    borderWidth: 1,
    borderColor: "#d5d8dc",
    borderRadius: 12,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    backgroundColor: "#ffffff",
  },

  alternateRow: {
    backgroundColor: "#f5f6f7",
  },

  headerRow: {
    minHeight: 52,
    backgroundColor: "#e2e5e9",
  },

  headerText: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: "700",
  },

  cellText: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },

  idColumn: {
    width: 60,
  },

  titleColumn: {
    width: 280,
  },

  dateColumn: {
    width: 200,
  },

  dayColumn: {
    width: 110,
  },

  timeColumn: {
    width: 110,
  },

  timezoneColumn: {
    width: 110,
  },

  statusColumn: {
    width: 110,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  activeBadge: {
    backgroundColor: "#dce8df",
  },

  inactiveBadge: {
    backgroundColor: "#e4e4e4",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  actionsColumn: {
    width: 190,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  actionButton: {
    minWidth: 70,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  editButton: {
    backgroundColor: "#2482AA",
  },

  deleteButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#c94a4a",
  },

  buttonPressed: {
    opacity: 0.7,
  },

  editButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },

  deleteButtonText: {
    color: "#a52a2a",
    fontSize: 13,
    fontWeight: "700",
  },

  centerText: {
    textAlign: "center",
  },

  typeColumn: {
    width: 110,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },

  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },

  weeklyTypeBadge: {
    backgroundColor: "#E5E7EB",
  },

  oneTimeTypeBadge: {
    backgroundColor: "#EAF4F8",
  },

  typeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
