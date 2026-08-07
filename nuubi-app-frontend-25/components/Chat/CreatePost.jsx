import * as React from "react";
import { API_URL } from "../../config";
import {
  TextInput,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Platform,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
const { createPostSchema } = require("../validationSchema");
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import * as ImageManipulator from "expo-image-manipulator";
import alert from "./../alert";
import * as SecureStore from "expo-secure-store";
import FAIcon from "@expo/vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

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
      .map(({ type, value }) => [
        type,
        value,
      ])
  );

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`,
  };
};

export default function CreatePostScreen({
  navigation,
  route,
}) {
  const { user } = React.useContext(AccountContext);
  const [status, setStatus] = React.useState(null);
  const [formKey, setFormKey] = React.useState(Date.now());
  const [statusColor, setStatusColor] = React.useState(globalStyles.captionError);
  const [pickedImage, setPickedImage] = React.useState(null);
  const [pickedFile, setPickedFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [publishMode, setPublishMode] = React.useState("now");
const [scheduledDate, setScheduledDate] = React.useState("");
const [timezone, setTimezone] = React.useState(
  "America/Los_Angeles"
);
const [hour, setHour] = React.useState("1");
const [minute, setMinute] = React.useState("30");
const [ampm, setAmpm] = React.useState("PM");

const isAdmin =
  user?.isAdmin === true ||
  String(user?.isAdmin).toLowerCase() === "true";
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
  const hourOptions = Array.from(
    { length: 12 },
    (_, index) => String(index + 1)
  );
  
  const minuteOptions = ["00", "15", "30", "45"];
  
  const ampmOptions = ["AM", "PM"];
  const editingScheduledPost =
  route.params?.scheduledPost || null;

const isEditingScheduledPost =
  route.params?.mode ===
    "editScheduledPost" &&
  Boolean(editingScheduledPost);

  useFocusEffect(
    React.useCallback(() => {
      setFormKey(Date.now());
      setStatus(null);
  
      if (!isEditingScheduledPost) {
        setPickedImage(null);
        setPickedFile(null);
      }
  
      if (isEditingScheduledPost) {
        setPublishMode("scheduled");
  
        setScheduledDate(
          editingScheduledPost?.scheduled_date || ""
        );
  
        setTimezone(
          editingScheduledPost?.timezone ||
            "America/Los_Angeles"
        );
  
        const [hourPart, minutePart] = String(
          editingScheduledPost?.scheduled_time || "13:30"
        ).split(":");
  
        const hour24 = Number(hourPart);
        const editAmPm = hour24 >= 12 ? "PM" : "AM";
        const hour12 = hour24 % 12 || 12;
  
        setHour(String(hour12));
        setMinute(minutePart || "30");
        setAmpm(editAmPm);
      } else {
        setPublishMode("now");
        setScheduledDate("");
        setTimezone("America/Los_Angeles");
        setHour("1");
        setMinute("30");
        setAmpm("PM");
      }
    }, [
      isEditingScheduledPost,
      editingScheduledPost,
    ])
  );
  

  const getS3PresignedUrl = async (fileName, fileType) => {
    const token = Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/file/s3-presigned-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ fileName, fileType }),
    });
    if (!response.ok) throw new Error("Failed to get S3 presigned URL");
    return await response.json();
  };

  const uploadToS3 = async (fileUri, fileName, fileType) => {
    try {
      const { uploadUrl, fileUrl } = await getS3PresignedUrl(fileName, fileType);
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": fileType },
      });
      if (!uploadResponse.ok) throw new Error("Failed to upload to S3");
      return fileUrl;
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw error;
    }
  };

  const resizeImage = async (imageInfo, resizeAmount) => {
    const resizedPhoto = await ImageManipulator.manipulateAsync(
      imageInfo.uri,
      [{ resize: { width: imageInfo.width * resizeAmount } }],
      { compress: 0.7, format: "jpeg", base64: true }
    );
    setPickedImage({ uri: resizedPhoto.uri, base64: resizedPhoto.base64 });
    const fileImg = await fetch(resizedPhoto.uri).then((r) => r.blob());
    if (fileImg.size > 10400000) resizeImage(imageInfo, resizeAmount * 0.5);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setPickedImage({
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
        width: result.assets[0].width,
      });
      if (result.assets[0].fileSize > 10400000) resizeImage(result.assets[0], 0.5);
    }
  };

  const pickFile = async () => {
    try {
      const filePickResponse = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (!filePickResponse.canceled) {
        const asset = filePickResponse.assets[0];
        setPickedFile({
          name: asset.name,
          type: asset.mimeType,
          uri: asset.uri,
          size: asset.size,
        });
        if (asset.size > 10400000) {
          alert("This file is too big. 10MB maximum.");
        }
      }
    } catch (error) {
      console.log("File pick error:", error);
    }
  };

  const resetApp = () => setPickedImage(null);
  const resetFile = () => setPickedFile(null);

  const convertTo24HourTime = (selectedHour, selectedMinute, selectedAmPm) => {
    let convertedHour = Number(selectedHour);

    if (selectedAmPm === "AM" && convertedHour === 12) {
      convertedHour = 0;
    }

    if (selectedAmPm === "PM" && convertedHour !== 12) {
      convertedHour += 12;
    }

    return `${String(convertedHour).padStart(2, "0")}:${String(
      selectedMinute
    ).padStart(2, "0")}`;
  };
  const {
    date: minimumScheduledDate,
  } = getCurrentDateTimeInTimezone(timezone);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={globalStyles.h3HeadingWhite}>Create Post</Text>,
      headerTitleAlign: "center",
    });
  }, [navigation]);

  

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Processing your post...</Text>
        </View>
      )}
      <ScrollView style={{ backgroundColor: "#fbfbfb" }}>
        {Platform.OS === "web" && (
          <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
            <FAIcon name="chevron-left" size={16} color="#2482AA" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
        <View style={styles.container}>
          <View style={styles.formWrapper}>
            <Formik
              key={formKey}
              initialValues={{ 
                title: editingScheduledPost?.title || "", 
                body_text: editingScheduledPost?.body_text || "",
              }}
              enableReinitialize={true}
              validationSchema={createPostSchema}
              onSubmit={async (values, actions) => {
                setLoading(true);
                try {
                  let imageUrl = null;
                  let fileUrl = null;
                  let fileName = null;

                  if (pickedImage) {
                    imageUrl = await uploadToS3(pickedImage.uri, `img-${Date.now()}.jpg`, "image/jpeg");
                  }
                  if (pickedFile) {
                    fileName = pickedFile.name;
                    fileUrl = await uploadToS3(pickedFile.uri, fileName, pickedFile.type || "application/octet-stream");
                  }

                  const token = Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : sessionStorage.getItem("token");
                  const res = await fetch(`${API_URL}/groups/${user.currentGroup}/createpost`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({
                      ...user,
                      ...values,
                      imageUrl,
                      fileUrl,
                      fileName,
                    }),
                  });

                  const responseText = await res.text();

console.log("Create post status:", res.status);
console.log("Create post response:", responseText);

let data = {};
try {
  data = responseText ? JSON.parse(responseText) : {};
} catch (parseError) {
  console.log("Create post response is not JSON:", parseError);
}

if (!res.ok) {
  throw new Error(
    data.error ||
      data.message ||
      data.status ||
      `Post creation failed with status ${res.status}`
  );
}

setStatus(data.status || "Post created successfully");
                  setStatusColor(globalStyles.captionErrorSuccess);
                  actions.resetForm();
                  setPickedImage(null);
                  setPickedFile(null);
                } catch (error) {
                  console.error("Create post error:", error);
                  setStatus(error.message || "Error creating post");
                  setStatusColor(globalStyles.captionError);
                } finally {
                  setTimeout(() => setLoading(false), 2000);
                }
              }}
            >
  {(props) => {
    const handleSchedulePost = async () => {
      const formErrors = await props.validateForm();

      if (Object.keys(formErrors).length > 0) {
        props.setTouched({
          title: true,
          body_text: true,
        });

        setStatus(
          "Please complete the required post fields."
        );
        setStatusColor(globalStyles.captionError);
        return;
      }

      if (!scheduledDate) {
        setStatus("Please select a publish date.");
        setStatusColor(globalStyles.captionError);
        return;
      }

      if (!user?.currentGroup) {
        setStatus("Missing group ID.");
        setStatusColor(globalStyles.captionError);
        return;
      }

      const scheduledTime = convertTo24HourTime(
        hour,
        minute,
        ampm
      );
      const {
        date: todayInSelectedTimezone,
        time: currentTimeInSelectedTimezone,
      } = getCurrentDateTimeInTimezone(
        timezone
      );
      
      if (
        scheduledDate <
        todayInSelectedTimezone
      ) {
        setStatus(
          "Publish date cannot be earlier than today."
        );
      
        setStatusColor(
          globalStyles.captionError
        );
      
        return;
      }
      
      if (
        scheduledDate ===
          todayInSelectedTimezone &&
        scheduledTime <=
          currentTimeInSelectedTimezone
      ) {
        setStatus(
          "When publishing today, please select a time later than the current time."
        );
      
        setStatusColor(
          globalStyles.captionError
        );
      
        return;
      }

      const token =
        Platform.OS !== "web"
          ? await SecureStore.getItemAsync("token")
          : sessionStorage.getItem("token");

      if (!token) {
        setStatus(
          "Authentication token not found. Please log in again."
        );
        setStatusColor(globalStyles.captionError);
        return;
      }

      setLoading(true);
      setStatus(null);
      

      try {
        let imageUrl =
  editingScheduledPost?.image_url || null;

let fileUrl =
  editingScheduledPost?.file_url || null;

let fileName =
  editingScheduledPost?.file_name || null;

/*
 * 如果使用者選了新圖片，就先上傳到 S3，
 * 再用新 URL 覆蓋原本附件。
 */
if (pickedImage) {
  imageUrl = await uploadToS3(
    pickedImage.uri,
    `img-${Date.now()}.jpg`,
    "image/jpeg"
  );
}

/*
 * 如果使用者選了新檔案，也先上傳到 S3。
 */
if (pickedFile) {
  fileName = pickedFile.name;

  fileUrl = await uploadToS3(
    pickedFile.uri,
    fileName,
    pickedFile.type ||
      "application/octet-stream"
  );
}
        const payload = {
          title: props.values.title.trim(),
          body_text: props.values.body_text.trim(),
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          timezone,
          image_url: imageUrl,
          file_url: fileUrl,
          file_name: fileName,
        };

        console.log("Create scheduled post payload:", payload);

const scheduledPostUrl = isEditingScheduledPost
  ? `${API_URL}/groups/${user.currentGroup}/scheduled-posts/${editingScheduledPost.id}`
  : `${API_URL}/groups/${user.currentGroup}/scheduled-posts`;

const scheduledPostMethod = isEditingScheduledPost
  ? "PATCH"
  : "POST";

console.log("Scheduled post request:", {
  url: scheduledPostUrl,
  method: scheduledPostMethod,
  editingId: editingScheduledPost?.id,
});

const response = await fetch(scheduledPostUrl, {
  method: scheduledPostMethod,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(payload),
});

const responseText = await response.text();

        console.log(
          "Create scheduled post status:",
          response.status
        );

        console.log(
          "Create scheduled post response:",
          responseText
        );

        let data = {};

        try {
          data = responseText
            ? JSON.parse(responseText)
            : {};
        } catch (parseError) {
          console.error(
            "Scheduled post response is not JSON:",
            parseError
          );
        }

        if (!response.ok) {
          const details = Array.isArray(data.details)
            ? data.details.join(" ")
            : "";

          throw new Error(
            details ||
              data.error ||
              data.message ||
              `Unable to schedule post: ${response.status}`
          );
        }

        setStatus(
          data.message ||
            "Post scheduled successfully."
        );

        setStatusColor(
          globalStyles.captionErrorSuccess
        );

        props.resetForm();
        setScheduledDate("");
        setTimezone("America/Los_Angeles");
        setHour("1");
        setMinute("30");
        setAmpm("PM");
        setPublishMode("now");
        setPickedImage(null);
        setPickedFile(null);
      } catch (error) {
        console.error(
          "Schedule post error:",
          error
        );

        setStatus(
          error.message ||
            "Unable to schedule post."
        );

        setStatusColor(globalStyles.captionError);
      } finally {
        setLoading(false);
      }
    };

    const handlePostButtonPress = async () => {
      if (
        isAdmin &&
        publishMode === "scheduled"
      ) {
        await handleSchedulePost();
        return;
      }

      props.handleSubmit();
    };

    return (
    <View>
      <Text style={statusColor}>{status}</Text>
  
      <View style={styles.createPostRow}>
        {/* Left side */}
        <View style={styles.leftColumn}>
                  <Text style={globalStyles.textInputLabel}>Post Title</Text>
                  <TextInput
                    style={globalStyles.textInput}
                    placeholder="Enter post title"
                    onChangeText={props.handleChange("title")}
                    value={props.values.title}
                  />
                  <ErrorMessage name="title" render={msg => <Text style={globalStyles.captionError}>{msg}</Text>} />

                  <Text style={globalStyles.textInputLabel}>Post</Text>
                  <View style={globalStyles.postContainer}>
                    <TextInput
                      style={globalStyles.postTextInput}
                      multiline={true}
                      placeholder="Enter text"
                      onChangeText={props.handleChange("body_text")}
                      value={props.values.body_text}
                    />
                    {props.values.body_text.match(/(https?:\/\/[^\s]+)/g) && (
                      <Text style={{ fontSize: 12, color: "#888", marginTop: 6, marginBottom: 2 }}>
                        {" "}Link detected:{" "}
                        <Text style={{ color: "#2482AA", textDecorationLine: "underline" }}>
                          {props.values.body_text.match(/(https?:\/\/[^\s]+)/g)[0]}
                        </Text>
                      </Text>
                    )}
                    {(pickedImage ||
  editingScheduledPost?.image_url) && (
  <Image
    style={
      globalStyles.squareImageContainer
    }
    source={{
      uri:
        pickedImage?.uri ||
        editingScheduledPost?.image_url,
    }}
  />
)}
                    {(pickedFile ||
  editingScheduledPost?.file_name) && (
  <Text style={globalStyles.captionError}>
    {pickedFile?.name ||
      editingScheduledPost?.file_name}
  </Text>
)}
                  </View>
                  <ErrorMessage
  name="body_text"
  render={(msg) => (
    <Text style={globalStyles.captionError}>{msg}</Text>
  )}
/>
<View style={styles.buttonRow}>
  <TouchableOpacity
    onPress={pickedImage ? resetApp : pickImage}
    
    style={[
      styles.iconButton,
      
    ]}
  >
    <MaterialIcon
      name={
        pickedImage
          ? "no-photography"
          : "add-a-photo"
      }
      size={30}
      color="#fff"
    />
  </TouchableOpacity>

  <TouchableOpacity
    onPress={pickedFile ? resetFile : pickFile}
    
    style={[
      styles.iconButton,
      
    ]}
  >
    <MaterialIcon
      name={
        pickedFile
          ? "edit-document"
          : "attach-file"
      }
      size={30}
      color="#fff"
    />
  </TouchableOpacity>

  <TouchableOpacity
  style={[
    styles.submitButton,
    loading && styles.disabledButton,
  ]}
  onPress={handlePostButtonPress}
  disabled={loading}
>
<Text style={globalStyles.primaryButtonText}>
  {loading
    ? "Processing..."
    : isEditingScheduledPost
      ? "Update Scheduled Post"
      : isAdmin &&
          publishMode === "scheduled"
        ? "Schedule Post"
        : "Create Post"}
</Text>
  </TouchableOpacity>
</View>

</View>
      {/* Right side */}
      {isAdmin && (
        <View style={styles.rightColumn}>
          <View style={styles.publishOptionsContainer}>
  <Text style={styles.sectionLabel}>
    Publish Option
  </Text>

  <View style={styles.publishOptionsRow}>
    <Pressable
      style={[
        styles.publishOption,
        styles.publishOptionLeft,
        publishMode === "now" &&
          styles.publishOptionSelected,
      ]}
      onPress={() => setPublishMode("now")}
    >
      <Text style={styles.radioIcon}>
        {publishMode === "now" ? "●" : "○"}
      </Text>

      <View style={styles.publishOptionTextContainer}>
        <Text style={styles.publishOptionTitle}>
          Post Now
        </Text>

        <Text style={styles.publishOptionDescription}>
          Publish this post immediately.
        </Text>
      </View>
    </Pressable>

    <Pressable
      style={[
        styles.publishOption,
        publishMode === "scheduled" &&
          styles.publishOptionSelected,
      ]}
      onPress={() => {
        setPublishMode("scheduled");
      }}
    >
      <Text style={styles.radioIcon}>
        {publishMode === "scheduled" ? "●" : "○"}
      </Text>

      <View style={styles.publishOptionTextContainer}>
        <Text style={styles.publishOptionTitle}>
          Schedule Post
        </Text>

        <Text style={styles.publishOptionDescription}>
          Publish this post at a selected date and time.
        </Text>
      </View>
    </Pressable>
  </View>
</View>

          {publishMode === "scheduled" && (
            <View style={styles.scheduleContainer}>

              <View style={styles.dateRow}>
              <View style={styles.scheduleField}>
  <Text style={styles.fieldLabel}>
    Publish Date
  </Text>

  {Platform.OS === "web" ? (
    <input
    type="date"
    value={scheduledDate}
    min={minimumScheduledDate}
    onChange={(event) => {
      const nextDate =
        event.target.value;
  
      if (
        nextDate &&
        nextDate < minimumScheduledDate
      ) {
        setStatus(
          "Publish date cannot be earlier than today."
        );
  
        setStatusColor(
          globalStyles.captionError
        );
  
        return;
      }
  
      setScheduledDate(nextDate);
    }}
    style={webDateInputStyle}
  />
  ) : (
    <TextInput
      style={globalStyles.textInput}
      value={scheduledDate}
      onChangeText={setScheduledDate}
      placeholder="YYYY-MM-DD"
    />
  )}
</View>
              </View>
              <View style={styles.scheduleField}>

              <Text style={styles.fieldLabel}>
                Publish Time
              </Text>

              <View style={styles.timeRow}>
                <View style={styles.timePickerWrapper}>
                  <Picker
                    selectedValue={hour}
                    onValueChange={setHour}
                    style={styles.picker}
                  >
                    {hourOptions.map((option) => (
                      <Picker.Item
                        key={option}
                        label={option}
                        value={option}
                      />
                    ))}
                  </Picker>
                </View>

                <Text style={styles.timeSeparator}>:</Text>

                <View style={styles.timePickerWrapper}>
                  <Picker
                    selectedValue={minute}
                    onValueChange={setMinute}
                    style={styles.picker}
                  >
                    {minuteOptions.map((option) => (
                      <Picker.Item
                        key={option}
                        label={option}
                        value={option}
                      />
                    ))}
                  </Picker>
                </View>

                <View style={styles.ampmPickerWrapper}>
                  <Picker
                    selectedValue={ampm}
                    onValueChange={setAmpm}
                    style={styles.picker}
                  >
                    {ampmOptions.map((option) => (
                      <Picker.Item
                        key={option}
                        label={option}
                        value={option}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              </View>
              <View style={styles.scheduleField}>
              <Text style={styles.fieldLabel}>
                Timezone
              </Text>

              <View style={styles.timezonePickerWrapper}>
                <Picker
                  selectedValue={timezone}
                  onValueChange={setTimezone}
                  style={styles.picker}
                >
                  {timezoneOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
              </View>

              <Text style={styles.scheduleHelperText}>
                The post will be published once at the selected
                date and time.
              </Text>
            </View>
          )}
        </View>
      )}
                  {/* Close createPostRow */}
                  </View>
          </View>
        );
      }}
    </Formik>
  </View>
</View>
</ScrollView>
</View>
);
}
const webDateInputStyle = {
  width: "100%",
  height: "56px",
  boxSizing: "border-box",
  padding: "0 16px",
  border: "1px solid #888888",
  borderRadius: "12px",
  backgroundColor: "#F1F1F1",
  color: "#666666",
  fontSize: "18px",
  outline: "none",
};

const styles = StyleSheet.create({
  createPostRow: {
    width: "100%",
    flexDirection: Platform.OS === "web" ? "row" : "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  
  leftColumn: {
    width: Platform.OS === "web" ? "48%" : "100%",
  },
  
  rightColumn: {
    width: Platform.OS === "web" ? "48%" : "100%",
    marginTop: Platform.OS === "web" ? 0 : 24,
  },
  
  dateRow: {
    width: "100%",
    flexDirection: "row",
  },
  
  dateField: {
    flex: 1,
  },
  scheduleContainer: {
    width: "100%",
    marginTop: 22,
    marginBottom: 16,
  },
  
  scheduleHeading: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 16,
  },
  
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  
  timeRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  
  timePickerWrapper: {
    flex: 1,
    minWidth: 0,
  },
  
  ampmPickerWrapper: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  
  timeSeparator: {
    width: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  
  timezonePickerWrapper: {
    width: "100%",
  },
  
  picker: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#888888",
    borderRadius: 12,
    backgroundColor: "#F1F1F1",
    color: "#666666",
    fontSize: 17,
    paddingHorizontal: 10,
    outlineStyle: "none",
  },

  scheduleField: {
    width: "100%",
    marginBottom: 28,
  },
  
  scheduleHelperText: {
    marginTop: 8,
    fontSize: 13,
    color: "#6B7280",
  },
  publishOptionsContainer: {
    width: "100%",
    marginTop: 0,
    marginBottom: 12,
  },
  publishOptionTextContainer: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  
  publishOption: {
    flex: 1,
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#888888",
    borderRadius: 12,
    backgroundColor: "#F1F1F1",
  },

  publishOptionLeft: {
    marginRight: 12,
  },
  
  publishOptionSelected: {
    borderColor: "#2482AA",
    borderWidth: 2,
    backgroundColor: "#EAF4F8",
  },
  
  radioIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  
  publishOptionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  
  publishOptionDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  publishOptionsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingText: { color: "#fff", marginTop: 10 },
  backButton: { flexDirection: "row", alignItems: "center", padding: 16 },
  backText: { color: "#2482AA", fontSize: 18, marginLeft: 8 },
  container: { flex: 1, alignItems: "center", paddingTop: 20 },
  formWrapper: { minWidth: 300, width: "90%", maxWidth: 1400, marginBottom: 400 },
  buttonRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: 12 },
  iconButton: { backgroundColor: "#2482AA", padding: 10, borderRadius: 20 },
  disabledButton: { opacity: 0.5 },
  submitButton: { backgroundColor: "#2482AA", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 20, width: "60%", alignItems: "center" },
});
