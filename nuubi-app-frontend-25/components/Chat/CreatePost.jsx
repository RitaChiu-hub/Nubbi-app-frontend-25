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
  Modal,
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

// ── Helper: split body_text into segments based on the applied link's display text ──
// Find the first occurrence of pickedLink.text and split the string into
// "before / link / after" segments.
function getDisplaySegments(text, links) {
  if (!links || links.length === 0 || !text) return [{ text: text || "", isLink: false }];
 
  // Locate the first match for each link.
  const matches = [];
  links.forEach((link) => {
    const idx = text.indexOf(link.text);
    if (idx !== -1) matches.push({ start: idx, end: idx + link.text.length });
  });
  if (matches.length === 0) return [{ text, isLink: false }];
 
  // Sort by position and drop any overlaps (keep the earliest match).
  matches.sort((a, b) => a.start - b.start);
  const merged = [];
  let lastEnd = 0;
  matches.forEach((m) => {
    if (m.start >= lastEnd) {
      merged.push(m);
      lastEnd = m.end;
    }
  });
 
  const segments = [];
  let cursor = 0;
  merged.forEach((m) => {
    if (m.start > cursor) segments.push({ text: text.slice(cursor, m.start), isLink: false });
    segments.push({ text: text.slice(m.start, m.end), isLink: true });
    cursor = m.end;
  });
  if (cursor < text.length) segments.push({ text: text.slice(cursor), isLink: false });
  return segments;
}

export default function CreatePostScreen({ navigation, route }) {
  const { user } = React.useContext(AccountContext);
  const [status, setStatus] = React.useState(null);
  const [formKey, setFormKey] = React.useState(Date.now());
  const [statusColor, setStatusColor] = React.useState(globalStyles.captionError);
  const [pickedImage, setPickedImage] = React.useState(null);
  const [pickedFile, setPickedFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [publishMode, setPublishMode] = React.useState("now");
  const [scheduledDate, setScheduledDate] = React.useState("");
  const [timezone, setTimezone] = React.useState("America/Los_Angeles");
  const [hour, setHour] = React.useState("1");
  const [minute, setMinute] = React.useState("30");
  const [ampm, setAmpm] = React.useState("PM");

  // ── Link state ────────────────────────────────────────────
  const [linkModalVisible, setLinkModalVisible] = React.useState(false);
  const [linkText, setLinkText] = React.useState("");    // display text
  const [linkInput, setLinkInput] = React.useState("");  // URL
  const [pickedLinks, setPickedLinks] = React.useState([]); // [{ text, url }]
  const [checkingLinkSafety, setCheckingLinkSafety] = React.useState(false);
  const formikRef = React.useRef(null);
  // ─────────────────────────────────────────────────────────

  const isAdmin =
    user?.isAdmin === true || String(user?.isAdmin).toLowerCase() === "true";
  const timezoneOptions = [
    { label: "Pacific Time", value: "America/Los_Angeles" },
    { label: "Central Time", value: "America/Chicago" },
    { label: "Eastern Time", value: "America/New_York" },
  ];
  const hourOptions = Array.from({ length: 12 }, (_, index) => String(index + 1));
  const minuteOptions = ["00", "15", "30", "45"];
  const ampmOptions = ["AM", "PM"];

  const editingScheduledPost = route.params?.scheduledPost || null;
  const isEditingScheduledPost =
    route.params?.mode === "editScheduledPost" && Boolean(editingScheduledPost);
    
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditingScheduledPost ? "Edit Post" : "Create Post",
    });
  }, [navigation, isEditingScheduledPost]);

  useFocusEffect(
    React.useCallback(() => {
      setFormKey(Date.now());
      setStatus(null);
  
      if (!isEditingScheduledPost) {
        setPickedImage(null);
        setPickedFile(null);
        setPickedLinks([]);
        setLinkText(""); 
        setLinkInput("");
      }
  
      if (isEditingScheduledPost) {
        setPublishMode("scheduled");
        setScheduledDate(editingScheduledPost?.scheduled_date || "");
        setTimezone(editingScheduledPost?.timezone || "America/Los_Angeles");
        const [hourString, minuteString] = String(
          editingScheduledPost?.scheduled_time || "13:30"
        ).split(":");
        const hour24 = Number(hourString);
        const convertedAmPm = hour24 >= 12 ? "PM" : "AM";
        const hour12 = hour24 % 12 || 12;
        setHour(String(hour12));
        setMinute(minuteString || "30");
        setAmpm(convertedAmPm);
      } else {
        setPublishMode("now");
        setScheduledDate("");
        setTimezone("America/Los_Angeles");
        setHour("1");
        setMinute("30");
        setAmpm("PM");
      }
    }, [isEditingScheduledPost, editingScheduledPost])
  );

  const checkUrlSafety = async (url) => {
    try {
      const token = Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : sessionStorage.getItem("token");
      const response = await fetch(`${API_URL}/file/check-url-safety`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) return { safe: true };
      return await response.json();
    } catch (error) {
      console.error("URL safety check error:", error);
      return { safe: true };
    }
  };

  const getS3PresignedUrl = async (fileName, fileType) => {
    const token = Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/file/s3-presigned-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({ fileName, fileType }),
    });
    if (!response.ok) throw new Error("Failed to get S3 presigned URL");
    return await response.json();
  };

  const uploadToS3 = async (fileUri, fileName, fileType) => {
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
    }
  };

  const pickFile = async () => {
    const filePickResponse = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!filePickResponse.canceled) {
      const asset = filePickResponse.assets[0];
      setPickedFile({
        name: asset.name,
        type: asset.mimeType,
        uri: asset.uri,
        size: asset.size,
      });
    }
  };

  const confirmLink = async () => {
    const trimmedUrl = linkInput.trim();  
    const trimmedText = linkText.trim();  
    if (!trimmedUrl) { alert("URL cannot be empty."); return; }
    if (!trimmedUrl.match(/^https?:\/\/.+\..+/)) { alert("Invalid URL."); return; }
    
    setCheckingLinkSafety(true);
    const safety = await checkUrlSafety(trimmedUrl);
    setCheckingLinkSafety(false);
 
    if (!safety?.safe) {
      alert(safety?.threatType ? `Flagged as "${safety.threatType}".` : "Flagged as unsafe.");
      return;
    }

    if (formikRef.current) {
      const currentText = formikRef.current.values.body_text;
      const displayText = trimmedText || trimmedUrl;
      const newText = currentText ? `${currentText} ${displayText}` : displayText;
      formikRef.current.setFieldValue("body_text", newText);
    }

    setPickedLinks((prev) => [...prev, { text: trimmedText || trimmedUrl, url: trimmedUrl }]);
    setLinkModalVisible(false);
    setLinkText("");
    setLinkInput("");
  };

  const resetApp = () => setPickedImage(null);
  const resetFile = () => setPickedFile(null);
  const clearAllLinks = () => setPickedLinks([]);

  const convertTo24HourTime = (selectedHour, selectedMinute, selectedAmPm) => {
    let hourVal = Number(selectedHour);
    if (selectedAmPm === "AM" && hourVal === 12) hourVal = 0;
    if (selectedAmPm === "PM" && hourVal !== 12) hourVal += 12;
    return `${String(hourVal).padStart(2, "0")}:${String(selectedMinute).padStart(2, "0")}`;
  };

  const { date: minimumScheduledDate } = getCurrentDateTimeInTimezone(timezone);

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}

      <Modal visible={linkModalVisible} transparent animationType="fade" onRequestClose={() => setLinkModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setLinkModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalBox}>
              <View style={styles.modalRow}>
                <MaterialIcon name="segment" size={20} color="#555" style={styles.modalIcon} />
                <TextInput style={styles.modalRowInput} placeholder="Word" value={linkText} onChangeText={setLinkText} />
              </View>
              <View style={styles.modalRow}>
                <MaterialIcon name="link" size={20} color="#555" style={styles.modalIcon} />
                <TextInput style={styles.modalRowInput} placeholder="URL" value={linkInput} onChangeText={setLinkInput} autoCapitalize="none" keyboardType="url" />
                <TouchableOpacity onPress={confirmLink} disabled={checkingLinkSafety}>
                  {checkingLinkSafety ? <ActivityIndicator size="small" color="#2482AA" /> : <Text style={styles.modalApplyText}>Apply</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

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
              innerRef={formikRef}
              key={formKey}
              initialValues={{
                title: editingScheduledPost?.title || route.params?.defaultTitle || "",
                body_text: editingScheduledPost?.body_text || route.params?.defaultContent || "",
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

                  let finalBodyText = values.body_text;
                  if (pickedLinks.length > 0) {
                    const matches = [];
                    pickedLinks.forEach((link) => {
                      const idx = finalBodyText.indexOf(link.text);
                      if (idx !== -1) matches.push({ start: idx, end: idx + link.text.length, url: link.url });
                    });
                    matches.sort((a, b) => a.start - b.start);
                    const merged = [];
                    let lastEnd = 0;
                    matches.forEach((m) => {
                      if (m.start >= lastEnd) { merged.push(m); lastEnd = m.end; }
                    });
                    for (let i = merged.length - 1; i >= 0; i--) {
                      const m = merged[i];
                      const displayText = finalBodyText.slice(m.start, m.end);
                      finalBodyText = finalBodyText.slice(0, m.start) + `[${displayText}](${m.url})` + finalBodyText.slice(m.end);
                    }
                  }

                  const token = Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : sessionStorage.getItem("token");
                  const res = await fetch(`${API_URL}/groups/${user.currentGroup}/createpost`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ ...user, ...values, body_text: finalBodyText, imageUrl, fileUrl, fileName }),
                  });

                  if (!res.ok) throw new Error("Post creation failed");
                  setStatus("Post created successfully");
                  setStatusColor(globalStyles.captionErrorSuccess);
                  actions.resetForm();
                  setPickedImage(null);
                  setPickedFile(null);
                  setPickedLinks([]);
                } catch (error) {
                  setStatus(error.message);
                  setStatusColor(globalStyles.captionError);
                } finally {
                  setTimeout(() => setLoading(false), 400);
                }
              }}
            >
              {(props) => {
                const handleSchedulePost = async () => {
                  const formErrors = await props.validateForm();
                  if (Object.keys(formErrors).length > 0) {
                    props.setTouched({ title: true, body_text: true });
                    setStatus("Please complete required fields.");
                    return;
                  }
                  if (!scheduledDate) { setStatus("Select a publish date."); return; }

                  const scheduledTime = convertTo24HourTime(hour, minute, ampm);
                  const { date: today, time: now } = getCurrentDateTimeInTimezone(timezone);
                  if (scheduledDate < today || (scheduledDate === today && scheduledTime <= now)) {
                    setStatus("Select a future time.");
                    return;
                  }

                  setLoading(true);
                  try {
                    let imageUrl = editingScheduledPost?.image_url || null;
                    let fileUrl = editingScheduledPost?.file_url || null;
                    let fileName = editingScheduledPost?.file_name || null;
                    if (pickedImage) imageUrl = await uploadToS3(pickedImage.uri, `img-${Date.now()}.jpg`, "image/jpeg");
                    if (pickedFile) { fileName = pickedFile.name; fileUrl = await uploadToS3(pickedFile.uri, fileName, pickedFile.type); }

                    let finalBodyText = props.values.body_text;
                    // (Same link assembly logic as onSubmit)
                    if (pickedLinks.length > 0) {
                      const matches = [];
                      pickedLinks.forEach((link) => {
                        const idx = finalBodyText.indexOf(link.text);
                        if (idx !== -1) matches.push({ start: idx, end: idx + link.text.length, url: link.url });
                      });
                      matches.sort((a, b) => a.start - b.start);
                      let lastEnd = 0;
                      const merged = matches.filter(m => { if(m.start >= lastEnd) { lastEnd = m.end; return true; } return false; });
                      for (let i = merged.length - 1; i >= 0; i--) {
                        const m = merged[i];
                        finalBodyText = finalBodyText.slice(0, m.start) + `[${finalBodyText.slice(m.start, m.end)}](${m.url})` + finalBodyText.slice(m.end);
                      }
                    }

                    const token = Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : sessionStorage.getItem("token");
                    const method = isEditingScheduledPost ? "PATCH" : "POST";
                    const url = isEditingScheduledPost 
                      ? `${API_URL}/groups/${user.currentGroup}/scheduled-posts/${editingScheduledPost.id}`
                      : `${API_URL}/groups/${user.currentGroup}/scheduled-posts`;

                    const res = await fetch(url, {
                      method,
                      credentials: "include",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                      body: JSON.stringify({
                        title: props.values.title,
                        body_text: finalBodyText,
                        scheduled_date: scheduledDate,
                        scheduled_time: scheduledTime,
                        timezone,
                        image_url: imageUrl,
                        file_url: fileUrl,
                        file_name: fileName,
                      }),
                    });

                    if (!res.ok) throw new Error("Schedule failed");
                    setStatus("Post scheduled.");
                    props.resetForm();
                    setPickedImage(null);
                    setPickedFile(null);
                    setPickedLinks([]);
                  } catch (error) {
                    setStatus(error.message);
                  } finally {
                    setLoading(false);
                  }
                };

                return (
                  <View>
                    <Text style={statusColor}>{status}</Text>
                    <View style={styles.createPostRow}>
                      <View style={styles.leftColumn}>
                        <Text style={globalStyles.textInputLabel}>Title</Text>
                        <TextInput style={globalStyles.textInput} placeholder="Title" onChangeText={props.handleChange("title")} value={props.values.title} />
                        <Text style={globalStyles.textInputLabel}>Post</Text>
                        <View style={globalStyles.postContainer}>
                          <View style={styles.postInputWrapper}>
                            <Text style={[globalStyles.postTextInput, styles.overlayText]} pointerEvents="none">
                              {getDisplaySegments(props.values.body_text, pickedLinks).map((seg, i) => (
                                <Text key={i} style={seg.isLink ? styles.inlineLinkText : null}>{seg.text}</Text>
                              ))}
                              {!props.values.body_text ? " " : ""}
                            </Text>
                            <TextInput
                              style={[globalStyles.postTextInput, styles.transparentInputText]}
                              multiline={true}
                              placeholder="Text"
                              onChangeText={props.handleChange("body_text")}
                              value={props.values.body_text}
                              cursorColor="#2482AA"
                              selectionColor="#2482AA55"
                            />
                          </View>
                          {pickedImage && <Image style={globalStyles.squareImageContainer} source={{ uri: pickedImage.uri }} />}
                          {pickedFile && <Text style={globalStyles.captionError}>{pickedFile.name}</Text>}
                        </View>
                        <View style={styles.buttonRow}>
                          <TouchableOpacity onPress={pickedImage ? resetApp : pickImage} style={styles.iconButton}>
                            <MaterialIcon name={pickedImage ? "no-photography" : "add-a-photo"} size={30} color="#fff" />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={pickedFile ? resetFile : pickFile} style={styles.iconButton}>
                            <MaterialIcon name={pickedFile ? "edit-document" : "attach-file"} size={30} color="#fff" />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => setLinkModalVisible(true)} onLongPress={clearAllLinks} style={[styles.iconButton, pickedLinks.length > 0 && { backgroundColor: "#e07b00" }]}>
                            <MaterialIcon name="add-link" size={30} color="#fff" />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.submitButton} onPress={isAdmin && publishMode === "scheduled" ? handleSchedulePost : props.handleSubmit} disabled={loading}>
                            <Text style={globalStyles.primaryButtonText}>{loading ? "..." : (isEditingScheduledPost ? "Update" : (publishMode === "scheduled" ? "Schedule" : "Create"))}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {isAdmin && (
                        <View style={styles.rightColumn}>
                          <Text style={styles.sectionLabel}>Publish Option</Text>
                          <View style={styles.publishOptionsRow}>
                            <Pressable style={[styles.publishOption, styles.publishOptionLeft, publishMode === "now" && styles.publishOptionSelected]} onPress={() => setPublishMode("now")}>
                              <Text style={styles.radioIcon}>{publishMode === "now" ? "●" : "○"}</Text>
                              <Text style={styles.publishOptionTitle}>Now</Text>
                            </Pressable>
                            <Pressable style={[styles.publishOption, publishMode === "scheduled" && styles.publishOptionSelected]} onPress={() => setPublishMode("scheduled")}>
                              <Text style={styles.radioIcon}>{publishMode === "scheduled" ? "●" : "○"}</Text>
                              <Text style={styles.publishOptionTitle}>Schedule</Text>
                            </Pressable>
                          </View>

                          {publishMode === "scheduled" && (
                            <View style={styles.scheduleContainer}>
                              <Text style={styles.fieldLabel}>Date</Text>
                              {Platform.OS === "web" ? (
                                <input type="date" value={scheduledDate} min={minimumScheduledDate} onChange={(e) => setScheduledDate(e.target.value)} style={webDateInputStyle} />
                              ) : (
                                <TextInput style={globalStyles.textInput} value={scheduledDate} onChangeText={setScheduledDate} placeholder="YYYY-MM-DD" />
                              )}
                              <Text style={styles.fieldLabel}>Time</Text>
                              <View style={styles.timeRow}>
                                <Picker selectedValue={hour} onValueChange={setHour} style={styles.picker}>{hourOptions.map(h => <Picker.Item key={h} label={h} value={h} />)}</Picker>
                                <Picker selectedValue={minute} onValueChange={setMinute} style={styles.picker}>{minuteOptions.map(m => <Picker.Item key={m} label={m} value={m} />)}</Picker>
                                <Picker selectedValue={ampm} onValueChange={setAmpm} style={styles.picker}>{ampmOptions.map(a => <Picker.Item key={a} label={a} value={a} />)}</Picker>
                              </View>
                              <Text style={styles.fieldLabel}>Timezone</Text>
                              <Picker selectedValue={timezone} onValueChange={setTimezone} style={styles.picker}>{timezoneOptions.map(o => <Picker.Item key={o.value} label={o.label} value={o.value} />)}</Picker>
                            </View>
                          )}
                        </View>
                      )}
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

const webDateInputStyle = { width: "100%", height: "56px", padding: "0 16px", border: "1px solid #ddd", borderRadius: "12px", backgroundColor: "#f1f1f1", fontSize: "16px" };
const styles = StyleSheet.create({
  createPostRow: { flexDirection: Platform.OS === "web" ? "row" : "column", justifyContent: "space-between" },
  leftColumn: { width: Platform.OS === "web" ? "48%" : "100%" },
  rightColumn: { width: Platform.OS === "web" ? "48%" : "100%", marginTop: Platform.OS === "web" ? 0 : 20 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20, gap: 10, flexWrap: "wrap" },
  iconButton: { backgroundColor: "#2482AA", padding: 10, borderRadius: 20 },
  submitButton: { backgroundColor: "#2482AA", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20, minWidth: 100, alignItems: "center" },
  postInputWrapper: { position: "relative" },
  overlayText: { position: "absolute", top: 0, left: 0, right: 0, color: "#050505" },
  transparentInputText: { color: "transparent" },
  inlineLinkText: { color: "#2482AA", textDecorationLine: "underline" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { backgroundColor: "#fff", padding: 20, borderRadius: 12, width: "90%", maxWidth: 400 },
  modalRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  modalIcon: { marginRight: 10 },
  modalRowInput: { flex: 1, height: 40 },
  modalApplyText: { color: "#2482AA", fontWeight: "bold" },
  publishOptionsRow: { flexDirection: "row", gap: 10 },
  publishOption: { flex: 1, padding: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, flexDirection: "row", alignItems: "center" },
  publishOptionSelected: { borderColor: "#2482AA", backgroundColor: "#f0f8ff" },
  radioIcon: { marginRight: 5 },
  timeRow: { flexDirection: "row", gap: 5 },
  picker: { flex: 1, height: 50 },
  sectionLabel: { fontWeight: "bold", marginBottom: 10 },
  fieldLabel: { marginTop: 10, marginBottom: 5 },
  container: { padding: 20 },
  formWrapper: { width: "100%" },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", zIndex: 10 }
});
