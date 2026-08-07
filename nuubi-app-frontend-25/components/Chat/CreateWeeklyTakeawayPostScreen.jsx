import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
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

  const from24HourTime = (scheduledTime) => {
    if (!scheduledTime) {
      return {
        hour: "1",
        minute: "30",
        ampm: "PM",
      };
    }
  
    const [hourString, minuteString] =
      scheduledTime.split(":");
  
    const hour24 = Number(hourString);
  
    const convertedAmPm =
      hour24 >= 12 ? "PM" : "AM";
  
    const hour12 =
      hour24 % 12 === 0
        ? 12
        : hour24 % 12;
  
    return {
      hour: String(hour12),
      minute: minuteString || "00",
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

  const editingSchedule =
  route.params?.schedule || null;

  const isEditing =
  route.params?.mode === "edit" &&
  Boolean(editingSchedule?.id);
  console.log("Edit route params:", route.params);
  console.log("Editing schedule:", editingSchedule);

  React.useLayoutEffect(() => {
    // header title
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>
          {isEditing
          ? "Edit Weekly Takeaway Post"
          : "Create Weekly Takeaway Post"}
        </Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation, isEditing]);

  const normalizeDate = (dateString) => {
    return dateString.trim().replaceAll("/", "-");
  };
  const getStoredToken = async () => {
    return Platform.OS !== "web"
      ? await SecureStore.getItemAsync("token")
      : sessionStorage.getItem("token");
  };
  const to24HourTime = (hour, minute, ampm) => {
    let h = Number(hour);
    const m = Number(minute);

    if (ampm === "PM" && h !== 12) {
      h += 12;
    }

    if (ampm === "AM" && h === 12) {
      h = 0;
    }

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };
  React.useEffect(() => {
    if (!isEditing || !editingSchedule) {
      return;
    }
  
    const convertedTime = from24HourTime(
      editingSchedule.scheduled_time
    );
  
    setTitle(editingSchedule.title || "");
    setBodyText(editingSchedule.body_text || "");
    setStartDate(editingSchedule.start_date || "");
    setEndDate(editingSchedule.end_date || "");
    setDayOfWeek(
      editingSchedule.day_of_week || "Monday"
    );
    setTimezone(
      editingSchedule.timezone ||
        "America/Los_Angeles"
    );
  
    setHour(convertedTime.hour);
    setMinute(convertedTime.minute);
    setAmpm(convertedTime.ampm);
  
    setStatus("");
  }, [
    isEditing,
    editingSchedule?.id,
  ]);

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

if (normalizedEndDate < normalizedStartDate) {
  throw new Error(
    "End date must be the same as or later than start date."
  );
}

      const token = await getStoredToken();

      if (!token) {
        throw new Error("JWT token is missing. Please log in again.");
      }
      const scheduledTime = to24HourTime(hour, minute, ampm);

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

const requestMethod =
  isEditing ? "PATCH" : "POST";

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
  data = responseText
    ? JSON.parse(responseText)
    : {};
} catch (parseError) {
  console.error(
    "Weekly takeaway response is not JSON:",
    parseError
  );
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
        `Failed to ${
          isEditing ? "update" : "create"
        } schedule. Status: ${res.status}`
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
  
    const formColumnsStyle = {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    alignItems: "flex-start",
    gap: Platform.OS === "web" ? 48 : 0,
    width: "100%",
  };

  const leftColumnStyle = {
    width: Platform.OS === "web" ? 560 : "100%",
  };

  const rightColumnStyle = {
    width: Platform.OS === "web" ? 560 : "100%",
  };

  const dateInputStyle = {
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
  const dateRowStyle = {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: Platform.OS === "web" ? 16 : 0,
    width: "100%",
    marginBottom: 20,
  };

  const dateFieldStyle = {
    flex: 1,
  };
  const timeRowStyle = {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  };

  const timePickerStyle = {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 10,
    backgroundColor: "#eeeeee",
    color: "#616161",
  };

  const timeColonStyle = {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 8,
    color: "#333",
  };

  const postTextAreaStyle = {
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

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
      <Text style={statusColor}>{status}</Text>

      <View style={formColumnsStyle}>
        {/* Left side: title + post content */}
        <View style={leftColumnStyle}>
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
              style={postTextAreaStyle}
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
        <View style={rightColumnStyle}>
          <View style={dateRowStyle}>
            <View style={dateFieldStyle}>
              <Text style={globalStyles.textInputLabel}>Start Date</Text>

              {Platform.OS === "web" ? (
                <input
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    ...dateInputStyle,
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

            <View style={dateFieldStyle}>
              <Text style={globalStyles.textInputLabel}>End Date</Text>

              {Platform.OS === "web" ? (
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    ...dateInputStyle,
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

          <View style={timeRowStyle}>
            <Picker
              selectedValue={hour}
              onValueChange={(value) => setHour(value)}
              style={timePickerStyle}
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

            <Text style={timeColonStyle}>:</Text>

            <Picker
              selectedValue={minute}
              onValueChange={(value) => setMinute(value)}
              style={timePickerStyle}
            >
              {["00", "15", "30", "45"].map((m) => (
                <Picker.Item key={m} label={m} value={m} />
              ))}
            </Picker>

            <Picker
              selectedValue={ampm}
              onValueChange={(value) => setAmpm(value)}
              style={[timePickerStyle, { marginLeft: 8 }]}
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
                ...dateInputStyle,
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
                ...dateInputStyle,
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
            {isEditing
    ? "Save Changes"
    : "Create Weekly Takeaway Post"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
