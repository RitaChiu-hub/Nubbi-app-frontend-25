import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../../config";
import { globalStyles } from "../../styles/global";
import alert from "../alert";
import { Picker } from "@react-native-picker/picker";

const defaultWeeklyContent = [
  "Hi class,",
  "",
  "Please share your thoughts about class this week.",
  "",
  "You can respond to one or more of the following questions:",
  "",
  "1. What is one thing you learned this week?",
  "2. What is one thing you are still stuck on or would like to understand better?",
  "3. What is one concept that started to make more sense to you this week?",
].join("\n");

const dayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timezoneOptions = [
  {
    label: "Pacific Time",
    value: "America/Los_Angeles",
  },
  {
    label: "Central Time",
    value: "America/Chicago",
  },
  {
    label: "Eastern Time",
    value: "America/New_York",
  },
];

const from24HourTime = (scheduledTime) => {
  if (!scheduledTime) {
    return {
      hour: "1",
      minute: "30",
      ampm: "PM",
    };
  }

  const [hourString, minuteString] = scheduledTime.split(":");

  const hour24 = Number(hourString);
  const convertedAmPm = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;

  return {
    hour: String(hour12),
    minute: minuteString || "30",
    ampm: convertedAmPm,
  };
};

export default function CreateWeeklyTakeawayPostScreen({ route, navigation }) {
  const groupId = route.params?.group_id || route.params?.groupId;

  const [title, setTitle] = useState("Weekly Takeaway");
  const [bodyText, setBodyText] = useState(defaultWeeklyContent);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState(globalStyles.captionError);
  const [loading, setLoading] = useState(false);
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [hour, setHour] = useState("1");
  const [minute, setMinute] = useState("30");
  const [ampm, setAmpm] = useState("PM");

  const editingSchedule = route.params?.schedule || null;

  const isEditing =
    route.params?.mode === "edit" && Boolean(editingSchedule?.id);
  console.log("Edit route params:", route.params);
  console.log("Editing schedule:", editingSchedule);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing
        ? "Edit Weekly Takeaway Post"
        : "Create Weekly Takeaway Post",
    });
  }, [navigation, isEditing]);

  const normalizeDate = (dateString) => {
    return dateString.trim().replaceAll("/", "-");
  };
  const getCurrentDateTimeInTimezone = (timeZone) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());

    const values = Object.fromEntries(
      parts
        .filter(({ type }) => type !== "literal")
        .map(({ type, value }) => [type, value])
    );

    return {
      date: `${values.year}-${values.month}-${values.day}`,
      time: `${values.hour}:${values.minute}`,
    };
  };

  const { date: today } = getCurrentDateTimeInTimezone(timezone);

  const getStoredToken = async () => {
    return Platform.OS !== "web"
      ? await SecureStore.getItemAsync("token")
      : sessionStorage.getItem("token");
  };
  const convertTo24HourTime = (hour, minute, ampm) => {
    let convertedHour = Number(hour);

    if (ampm === "AM" && convertedHour === 12) {
      convertedHour = 0;
    }

    if (ampm === "PM" && convertedHour !== 12) {
      convertedHour += 12;
    }

    return `${String(convertedHour).padStart(2, "0")}:${minute}`;
  };
  // Populate the form with the existing schedule when editing.
  React.useEffect(() => {
    if (!isEditing || !editingSchedule) {
      return;
    }

    const convertedTime = from24HourTime(editingSchedule.scheduled_time);

    setTitle(editingSchedule.title || "");
    setBodyText(editingSchedule.body_text || "");
    setStartDate(editingSchedule.start_date || "");
    setEndDate(editingSchedule.end_date || "");
    setDayOfWeek(editingSchedule.day_of_week || "Monday");
    setTimezone(editingSchedule.timezone || "America/Los_Angeles");

    setHour(convertedTime.hour);
    setMinute(convertedTime.minute);
    setAmpm(convertedTime.ampm);

    setStatus("");
  }, [isEditing, editingSchedule?.id]);

  const handleCreateWeeklyTakeawayPost = async () => {
    setLoading(true);
    setStatus("");

    try {
      if (!groupId) {
        throw new Error("Missing group id.");
      }

      if (
        !title ||
        !bodyText ||
        !startDate ||
        !endDate ||
        !dayOfWeek ||
        !timezone
      ) {
        throw new Error("Please fill in all fields.");
      }
      const normalizedStartDate = normalizeDate(startDate);
      const normalizedEndDate = normalizeDate(endDate);

      const {
        date: todayInSelectedTimezone,
        time: currentTimeInSelectedTimezone,
      } = getCurrentDateTimeInTimezone(timezone);

      if (normalizedStartDate < todayInSelectedTimezone) {
        throw new Error("Start date cannot be before today.");
      }

      if (normalizedEndDate < todayInSelectedTimezone) {
        throw new Error("End date cannot be before today.");
      }

      if (normalizedEndDate < normalizedStartDate) {
        throw new Error(
          "End date must be the same as or later than start date."
        );
      }

      const token = await getStoredToken();

      if (!token) {
        throw new Error("JWT token is missing. Please log in again.");
      }
      const scheduledTime = convertTo24HourTime(hour, minute, ampm);

      if (normalizedStartDate === todayInSelectedTimezone) {
        if (scheduledTime <= currentTimeInSelectedTimezone) {
          throw new Error(
            "If the start date is today, the post time must be in the future."
          );
        }
      }

      const payload = {
        start_date: normalizedStartDate,
        end_date: normalizedEndDate,
        day_of_week: dayOfWeek,
        timezone,
        scheduled_time: scheduledTime,
        title,
        body_text: bodyText,
      };

      const requestUrl = isEditing
        ? `${API_URL}/groups/${groupId}/weekly-takeaway-schedules/${editingSchedule.id}`
        : `${API_URL}/groups/${groupId}/weekly-takeaway-schedules`;

      const requestMethod = isEditing ? "PATCH" : "POST";

      console.log(
        isEditing
          ? "Update Weekly Takeaway Schedule URL:"
          : "Create Weekly Takeaway Schedule URL:",
        requestUrl
      );

      console.log(
        isEditing
          ? "Update Weekly Takeaway Schedule payload:"
          : "Create Weekly Takeaway Schedule payload:",
        payload
      );

      const res = await fetch(requestUrl, {
        method: requestMethod,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();

      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Weekly takeaway response is not JSON:", parseError);
      }

      console.log(
        isEditing
          ? "Update weekly takeaway schedule response:"
          : "Create weekly takeaway schedule response:",
        data
      );

      if (!res.ok) {
        throw new Error(
          data?.details?.[0] ||
            data?.error ||
            data?.message ||
            `Failed to ${isEditing ? "update" : "create"} schedule. Status: ${
              res.status
            }`
        );
      }

      if (isEditing) {
        navigation.goBack();
      } else {
        navigation.navigate("Group Tabs", {
          screen: "Threads",
          params: {
            groupId,
            scheduleCreatedAt: Date.now(),
          },
        });
      }
    } catch (error) {
      console.error(
        isEditing
          ? "Update weekly takeaway error:"
          : "Create weekly takeaway error:",
        error
      );

      setStatus(
        error.message ||
          `Failed to ${
            isEditing ? "update" : "create"
          } weekly takeaway schedule.`
      );

      setStatusColor(globalStyles.captionError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
      <Text style={statusColor}>{status}</Text>

      <View style={styles.formColumns}>
        {/* Left side: title + post content */}
        <View style={styles.leftColumn}>
          <Text style={globalStyles.textInputLabel}>Post Title</Text>
          <TextInput
            style={[globalStyles.textInput, { maxWidth: 560 }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter post title"
          />

          <Text style={globalStyles.textInputLabel}>Post</Text>

          {Platform.OS === "web" ? (
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder="Enter weekly takeaway prompt"
              style={webPostTextAreaStyle}
            />
          ) : (
            <View style={globalStyles.postContainer}>
              <TextInput
                style={globalStyles.postTextInput}
                multiline={true}
                value={bodyText}
                onChangeText={setBodyText}
                placeholder="Enter weekly takeaway prompt"
              />
            </View>
          )}
        </View>

        {/* Right side: schedule settings */}
        <View style={styles.rightColumn}>
          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={globalStyles.textInputLabel}>Start Date</Text>

              {Platform.OS === "web" ? (
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  max={endDate || undefined}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    ...webDateInputStyle,
                    marginBottom: 0,
                  }}
                />
              ) : (
                <TextInput
                  style={[globalStyles.textInput, { width: "100%" }]}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="YYYY-MM-DD"
                />
              )}
            </View>

            <View style={styles.dateField}>
              <Text style={globalStyles.textInputLabel}>End Date</Text>

              {Platform.OS === "web" ? (
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    ...webDateInputStyle,
                    marginBottom: 0,
                  }}
                />
              ) : (
                <TextInput
                  style={[globalStyles.textInput, { width: "100%" }]}
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="YYYY-MM-DD"
                />
              )}
            </View>
          </View>

          <Text style={globalStyles.textInputLabel}>Post Time</Text>

          <View style={styles.timeRow}>
            <Picker
              selectedValue={hour}
              onValueChange={(value) => setHour(value)}
              style={styles.timePicker}
            >
              {[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12",
              ].map((h) => (
                <Picker.Item key={h} label={h} value={h} />
              ))}
            </Picker>

            <Text style={styles.timeColon}>:</Text>

            <Picker
              selectedValue={minute}
              onValueChange={(value) => setMinute(value)}
              style={styles.timePicker}
            >
              {["00", "15", "30", "45"].map((m) => (
                <Picker.Item key={m} label={m} value={m} />
              ))}
            </Picker>

            <Picker
              selectedValue={ampm}
              onValueChange={(value) => setAmpm(value)}
              style={[styles.timePicker, styles.ampmPicker]}
            >
              <Picker.Item label="AM" value="AM" />
              <Picker.Item label="PM" value="PM" />
            </Picker>
          </View>

          <Text style={globalStyles.textInputLabel}>Timezone</Text>

          {Platform.OS === "web" ? (
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              style={{
                ...webDateInputStyle,
                cursor: "pointer",
                marginBottom: 24,
              }}
            >
              {timezoneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 8,
                marginBottom: 24,
              }}
            >
              {timezoneOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setTimezone(option.value)}
                  style={[
                    globalStyles.primaryButton,
                    {
                      width: 180,
                      opacity: timezone === option.value ? 1 : 0.5,
                    },
                  ]}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={globalStyles.textInputLabel}>Day of Week</Text>

          {Platform.OS === "web" ? (
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              style={{
                ...webDateInputStyle,
                cursor: "pointer",
                marginBottom: 24,
              }}
            >
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          ) : (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 8,
                marginBottom: 24,
              }}
            >
              {dayOptions.map((day) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => setDayOfWeek(day)}
                  style={[
                    globalStyles.primaryButton,
                    {
                      width: 120,
                      opacity: dayOfWeek === day ? 1 : 0.5,
                    },
                  ]}
                >
                  <Text style={globalStyles.primaryButtonText}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[globalStyles.primaryButton, { width: "100%" }]}
            onPress={handleCreateWeeklyTakeawayPost}
            disabled={loading}
          >
            <Text style={globalStyles.primaryButtonText}>
              {isEditing ? "Save Changes" : "Create Weekly Takeaway Post"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formColumns: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    alignItems: "flex-start",
    gap: Platform.OS === "web" ? 48 : 0,
    width: "100%",
  },

  leftColumn: {
    width: Platform.OS === "web" ? 560 : "100%",
  },

  rightColumn: {
    width: Platform.OS === "web" ? 560 : "100%",
  },

  dateRow: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: Platform.OS === "web" ? 16 : 0,
    width: "100%",
    marginBottom: 20,
  },

  dateField: {
    flex: 1,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },

  timePicker: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 10,
    backgroundColor: "#eeeeee",
    color: "#616161",
  },

  ampmPicker: {
    marginLeft: 8,
  },

  timeColon: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 8,
    color: "#333",
  },
});

const webDateInputStyle = {
  width: "100%",
  height: 48,
  borderRadius: 10,
  border: "1px solid #777",
  padding: "0 16px",
  fontSize: 16,
  fontFamily: "Poppins_400Regular, Poppins, sans-serif",
  color: "#616161",
  backgroundColor: "#eeeeee",
  boxSizing: "border-box",
  marginBottom: 20,
};

const webPostTextAreaStyle = {
  width: "100%",
  minHeight: 300,
  resize: "vertical",
  overflow: "auto",
  borderRadius: 10,
  border: "1px solid #777",
  padding: 16,
  fontSize: 16,
  fontFamily: "Poppins_400Regular, Poppins, sans-serif",
  color: "#616161",
  backgroundColor: "#eeeeee",
  boxSizing: "border-box",
  outline: "none",
};
