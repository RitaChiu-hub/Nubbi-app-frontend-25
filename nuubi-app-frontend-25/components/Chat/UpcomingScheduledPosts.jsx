import React from "react";
import {
  Modal,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

function formatScheduledTime(dateTime, timezone) {
  if (!dateTime) {
    return "Scheduled time unavailable";
  }

  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(new Date(dateTime));
  } catch (error) {
    console.error("Unable to format scheduled time:", error);
    return dateTime;
  }
}
const getTimezoneAbbreviation = (timezone, dateValue) => {
  if (!timezone) {
    return "—";
  }

  try {
    const date = dateValue ? new Date(dateValue) : new Date();

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
};

export default function UpcomingScheduledPosts({
  schedules = [],
  onViewAll,
  onEditSchedule,
}) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const [selectedSchedule, setSelectedSchedule] = React.useState(null);
  const closePreview = () => {
    setSelectedSchedule(null);
  };

  const handleEditSelectedSchedule = () => {
    if (!selectedSchedule) {
      return;
    }

    const scheduleToEdit = selectedSchedule;

    setSelectedSchedule(null);
    onEditSchedule?.(scheduleToEdit);
  };

  const visibleSchedules = schedules.slice(0, 3);
  const selectedIsOneTime = selectedSchedule?.schedule_type === "one_time";

  const selectedStatus = selectedIsOneTime
    ? selectedSchedule?.status || "pending"
    : selectedSchedule?.is_active
    ? "Active"
    : "Inactive";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Upcoming Scheduled Posts</Text>

        <Pressable
          onPress={() => setIsExpanded((previous) => !previous)}
          accessibilityRole="button"
          accessibilityLabel={
            isExpanded
              ? "Collapse upcoming scheduled posts"
              : "Expand upcoming scheduled posts"
          }
          accessibilityState={{ expanded: isExpanded }}
          hitSlop={8}
        >
          <Text style={styles.collapseText}>
            {isExpanded ? "Collapse ▲" : "Expand ▼"}
          </Text>
        </Pressable>
      </View>

      {isExpanded &&
        visibleSchedules.map((schedule) => (
          <Pressable
            key={
              schedule.schedule_key ||
              `${schedule.schedule_type}-${schedule.id}`
            }
            style={({ pressed }) => [
              styles.scheduleCard,
              pressed && styles.scheduleCardPressed,
            ]}
            onPress={() => {
              setSelectedSchedule(schedule);
            }}
            accessibilityLabel={`Preview scheduled post ${
              schedule.title || "Scheduled Post"
            }`}
          >
            <Text style={styles.badgeText}>
              {schedule.schedule_type === "one_time"
                ? "One-time Scheduled"
                : "Weekly Scheduled"}
            </Text>

            <Text style={styles.title}>
              {schedule.title || "Weekly Takeaway"}
            </Text>

            <Text style={styles.date}>
              Next post:{" "}
              {formatScheduledTime(
                schedule.next_scheduled_at,
                schedule.timezone
              )}
            </Text>

            <Text style={styles.previewHint}>Click to preview</Text>
          </Pressable>
        ))}

      {isExpanded && (
        <Pressable
          style={({ pressed }) => [
            styles.moreButton,
            pressed && styles.moreButtonPressed,
          ]}
          onPress={() => {
            console.log("View all scheduled posts pressed");
            onViewAll?.();
          }}
          accessibilityRole="button"
          accessibilityLabel={`View all ${schedules.length} scheduled posts`}
        >
          <Text style={styles.moreText}>View all scheduled posts →</Text>
        </Pressable>
      )}
      <Modal
        visible={Boolean(selectedSchedule)}
        transparent
        animationType="fade"
        onRequestClose={closePreview}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard} accessibilityViewIsModal>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Scheduled Post Preview</Text>

              <Pressable
                onPress={closePreview}
                accessibilityRole="button"
                accessibilityLabel="Close scheduled post preview"
                hitSlop={8}
              >
                <Text style={styles.closeIcon}>×</Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalContent}
              contentContainerStyle={styles.modalContentContainer}
            >
              <View style={styles.previewBadge}>
                <Text style={styles.previewBadgeText}>
                  {selectedIsOneTime
                    ? "One-time Scheduled"
                    : "Weekly Scheduled"}
                </Text>
              </View>

              <Text style={styles.previewLabel}>Title</Text>

              <Text style={styles.previewTitle}>
                {selectedSchedule?.title || "Weekly Takeaway"}
              </Text>

              <Text style={styles.previewLabel}>Post</Text>

              <Text style={styles.previewBody}>
                {selectedSchedule?.body_text || "No post content available."}
              </Text>

              <View style={styles.previewScheduleBox}>
                <Text style={styles.previewSectionLabel}>Schedule</Text>
                // Show the schedule fields for the selected schedule type.
                {selectedIsOneTime ? (
                  <>
                    <Text style={styles.previewScheduleText}>
                      Publish date:{" "}
                      {selectedSchedule?.scheduled_date ||
                        selectedSchedule?.display_date ||
                        "—"}
                    </Text>

                    <Text style={styles.previewScheduleText}>
                      Time:{" "}
                      {selectedSchedule?.scheduled_time ||
                        selectedSchedule?.display_time ||
                        "—"}
                    </Text>

                    <Text style={styles.previewScheduleText}>
                      Timezone:{" "}
                      {getTimezoneAbbreviation(
                        selectedSchedule?.timezone,
                        selectedSchedule?.scheduled_at ||
                          selectedSchedule?.scheduled_date
                      )}
                    </Text>

                    <Text style={styles.previewScheduleText}>
                      Status: {selectedStatus}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.previewScheduleText}>
                      Start date: {selectedSchedule?.start_date || "—"}
                    </Text>

                    <Text style={styles.previewScheduleText}>
                      End date: {selectedSchedule?.end_date || "—"}
                    </Text>

                    <Text style={styles.previewScheduleText}>
                      Day: {selectedSchedule?.day_of_week || "—"}
                    </Text>

                    <Text style={styles.previewScheduleText}>
                      Time: {selectedSchedule?.scheduled_time || "—"}
                    </Text>

                    <Text style={styles.previewScheduleText}>
                      Timezone:{" "}
                      {getTimezoneAbbreviation(
                        selectedSchedule?.timezone,
                        selectedSchedule?.next_scheduled_at ||
                          selectedSchedule?.start_date
                      )}
                    </Text>

                    <Text style={styles.previewScheduleText}>
                      Status: {selectedStatus}
                    </Text>
                  </>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
                onPress={handleEditSelectedSchedule}
                accessibilityRole="button"
                accessibilityLabel={`Edit ${
                  selectedSchedule?.title || "scheduled post"
                }`}
              >
                <Text style={styles.closeButtonText}>Edit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    padding: 16,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  heading: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
  },
  collapseText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scheduleCard: {
    marginTop: 14,
    padding: 14,
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
  },
  badge: {
    alignSelf: "flex-start",
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#d1d5db",
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  date: {
    marginTop: 6,
    fontSize: 15,
  },
  timezone: {
    marginTop: 3,
    fontSize: 13,
    color: "#4b5563",
  },
  moreButton: {
    alignSelf: "center",
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  moreButtonPressed: {
    backgroundColor: "#e1e4e8",
  },

  moreText: {
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  scheduleCardPressed: {
    opacity: 0.75,
  },

  previewHint: {
    marginTop: 6,
    fontSize: 12,
    color: "#555555",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  modalCard: {
    width: "100%",
    maxWidth: 760,
    maxHeight: "85%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },

  modalHeading: {
    flex: 1,
    fontSize: 21,
    fontWeight: "700",
  },

  closeIcon: {
    paddingLeft: 16,
    fontSize: 30,
    lineHeight: 30,
    fontWeight: "400",
  },

  modalContent: {
    flexGrow: 0,
  },

  modalContentContainer: {
    padding: 20,
  },

  previewBadge: {
    alignSelf: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: "#e1e4e8",
  },

  previewBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  previewSectionLabel: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "700",
  },
  previewLabel: {
    marginTop: 14,
    marginBottom: 5,
    fontSize: 13,
    fontWeight: "700",
    color: "#555555",
  },

  previewTitle: {
    fontSize: 21,
    fontWeight: "700",
  },

  previewBody: {
    fontSize: 16,
    lineHeight: 25,
  },

  scheduleDetails: {
    marginTop: 12,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#f2f3f5",
  },

  detailText: {
    marginTop: 4,
    fontSize: 14,
  },

  modalFooter: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },

  closeButton: {
    minWidth: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#2482AA",
  },

  closeButtonPressed: {
    opacity: 0.75,
  },

  closeButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
