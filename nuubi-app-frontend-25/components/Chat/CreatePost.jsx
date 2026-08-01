import * as React from "react";
import { API_URL } from "../../config";
import {
  TextInput,
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Keyboard,
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
import IonIcon from "@expo/vector-icons/Ionicons";
import * as ImageManipulator from "expo-image-manipulator";
import alert from "./../alert";
import * as SecureStore from "expo-secure-store";
import FAIcon from "@expo/vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";

 
// ── Helper: split body_text into segments based on the applied link's display text ──
// Find the first occurrence of pickedLink.text and split the string into
// "before / link / after" segments.
// Since the extracted text is character-for-character identical to the
// original text (no characters are hidden), the overlay text layer and the
// underlying TextInput's actual text stay aligned in length and line-wrapping,
// so the cursor position never drifts.
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
 
export default function CreatePostScreen({ navigation }) {
export default function CreatePostScreen({ navigation, route }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [status, setStatus] = React.useState(null);
  const [formKey, setFormKey] = React.useState(Date.now());
  const [statusColor, setStatusColor] = React.useState(globalStyles.captionError);
  const [pickedImage, setPickedImage] = React.useState(null);
  const [pickedFile, setPickedFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // ── Link state ────────────────────────────────────────────
  const [linkModalVisible, setLinkModalVisible] = React.useState(false);
  const [linkText, setLinkText] = React.useState("");    // display text
  const [linkInput, setLinkInput] = React.useState("");  // URL
  const [pickedLinks, setPickedLinks] = React.useState([]); // [{ text, url }]
  const [checkingLinkSafety, setCheckingLinkSafety] = React.useState(false); // whether the link safety check is currently running
  const formikRef = React.useRef(null); // ref to access Formik helpers
  // ─────────────────────────────────────────────────────────


  useFocusEffect(
    React.useCallback(() => {
      setFormKey(Date.now());
      setStatus(null);
      setPickedImage(null);
      setPickedFile(null);
      setPickedLinks([]);
      setLinkText(""); 
      setLinkInput("");
    }, [])
  );

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


  // Calls our backend API, which uses the Google Safe Browsing API key to check
  // whether this URL is flagged as malware or a phishing site. The API key must
  // never live in the frontend, so we only hand the URL to our own backend,
  // and the backend is the one that queries Google.
  //
  // The path `${API_URL}/file/check-url-safety` is a reserved backend endpoint.
  //    The backend needs to implement this route for it to actually take effect.
  //
  // Fail-open strategy: if the check request itself fails (network issue,
  // backend not ready yet, etc.), we currently choose to treat it as "safe"
  // and let the user proceed, rather than blocking normal posting just because
  // the safety-check service itself is unreliable. If you'd rather have a more
  // conservative fail-closed behavior (block the link whenever the check fails),
  // change the `safe` value returned in the catch block below to `false`.
  // This is a security-vs-availability tradeoff — worth confirming with the
  // team lead which one they want.
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
 
      if (!response.ok) {
        console.warn("URL safety check request failed with status:", response.status);
        return { safe: true }; // fail-open: the check request itself failed, don't block the user
      }
 
      const data = await response.json();
      // Expected backend response shape: { safe: boolean, threatType?: string }
      return data;
    } catch (error) {
      console.error("URL safety check error:", error);
      return { safe: true }; // fail-open: network error etc., don't block the user
    }
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
// ── Link handlers ─────────────────────────────────────────
   const confirmLink = async () => {
  
   const trimmedUrl = linkInput.trim();  
   const trimmedText = linkText.trim();  

   if (!trimmedUrl) {
    alert("URL cannot be empty.");
    return;
  }
  if (!trimmedUrl.match(/^https?:\/\/.+\..+/)) {
    alert("Invalid URL. Must start with http:// or https://");
    return;
  }
  
  // Before applying the link, check the URL's safety via Google Safe Browsing.
  // While the check is running, disable the Apply button (to prevent double
  // taps) and only proceed once the check has finished.
  setCheckingLinkSafety(true);
  const safety = await checkUrlSafety(trimmedUrl);
  setCheckingLinkSafety(false);
 
  if (!safety?.safe) {
    alert(
      safety?.threatType
        ? `This link was flagged as "${safety.threatType}" by Google Safe Browsing and can't be added.`
        : "This link was flagged as unsafe and can't be added."
    );
    return;
  }

  // Insert the "display text" directly into the user's typing area
  // (appended naturally to the existing content), so the link text itself
  // becomes part of the post content. The actual [text](url) markdown
  // syntax is only assembled when the post is submitted — while editing,
  // the user only ever sees natural text.

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
  // ─────────────────────────────────────────────────────────
  

  const resetApp = () => setPickedImage(null);
  const resetFile = () => setPickedFile(null);
  const clearAllLinks = () => setPickedLinks([]); // clear every link
  
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

       {/* ── Link Modal (Gmail style) ── */}
      <Modal
  visible={linkModalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setLinkModalVisible(false)}
>
  <TouchableOpacity
    style={styles.modalOverlay}
    activeOpacity={1}
    onPress={() => setLinkModalVisible(false)}
  >
    {/* Prevent touch events from propagating to the overlay */}
    <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
      <View style={styles.modalBox}>
        {/* Text input */}
        <View style={styles.modalRow}>
          <MaterialIcon name="segment" size={20} color="#555" style={styles.modalIcon} />
          <TextInput
            style={styles.modalRowInput}
            placeholder="Word"
            value={linkText}
            onChangeText={setLinkText}
          />
        </View>
        {/* link input */}
        <View style={styles.modalRow}>
          <MaterialIcon name="link" size={20} color="#555555ff" style={styles.modalIcon} />
          <TextInput
            style={styles.modalRowInput}
            placeholder="Type in Link or Paste"
            value={linkInput}
            onChangeText={setLinkInput}
            autoCapitalize="none"
            keyboardType="url"
          />
          <TouchableOpacity onPress={confirmLink}>
            <Text style={styles.modalApplyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  </TouchableOpacity>
</Modal>
      {/* ─────────────────────────── */}

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
              innerRef={formikRef}
              initialValues={{ title: "", body_text: "" }}
              initialValues={{ 
                title: route.params?.defaultTitle || "", 
                body_text: route.params?.defaultContent || "",
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

                // What the user sees in the typing area is natural text (e.g. "youtube").
                // Here, at the moment of submission, that segment of text is replaced with
                // the full [text](url) markdown syntax, which gets saved to the database
                // and rendered as a hyperlink by View Post.
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
                      if (m.start >= lastEnd) {
                        merged.push(m);
                        lastEnd = m.end;
                      }
                    });
                    // Insert right-to-left so earlier match positions stay valid
                    // as we splice later (rightmost) ones in first.
                    for (let i = merged.length - 1; i >= 0; i--) {
                      const m = merged[i];
                      const displayText = finalBodyText.slice(m.start, m.end);
                      const markdownLink = `[${displayText}](${m.url})`;
                      finalBodyText = finalBodyText.slice(0, m.start) + markdownLink + finalBodyText.slice(m.end);
                    }
                  }

                  const token = Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : sessionStorage.getItem("token");
                  const res = await fetch(`${API_URL}/groups/${user.currentGroup}/createpost`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({
                      ...user,
                      ...values,
                      body_text: finalBodyText,
                      imageUrl,
                      fileUrl,
                      fileName,
                      image_url: imageUrl,
                      file_url: fileUrl,
                      file_name: fileName,
                    }),
                    credentials: "include",
                    body: JSON.stringify({ ...user, ...values, imageUrl, fileUrl, fileName }),
                  });

                  if (!res.ok) throw new Error("Post creation failed");
                  const data = await res.json();
                  setUser({ ...data });
                  setStatus(data.status || "Post created successfully");
                  setStatusColor(globalStyles.captionErrorSuccess);
                  actions.resetForm();
                  setPickedImage(null);
                  setPickedFile(null);
                  setPickedLinks([]);
                } catch (error) {
                  console.error(error);
                  setStatus("Error creating post");
                  setStatusColor(globalStyles.captionError);
                } finally {
                  setTimeout(() => setLoading(false), 2000);
                }
              }}
            >
              {(props) => (
                <View>
                  <Text style={statusColor}>{status}</Text>
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
                      <View style={styles.postInputWrapper}>
                      {/* Overlay: colors the text segment corresponding to the applied link
                       blue with an underline, visually displaying it as a clickable hyperlink style, layered on top of the typing area */}
                      <Text
                        style={[globalStyles.postTextInput, styles.overlayText]}
                        pointerEvents="none"
                      >
                        {getDisplaySegments(props.values.body_text, pickedLinks).map((seg, i) =>
                          seg.isLink ? (
                            <Text key={i} style={styles.inlineLinkText}>{seg.text}</Text>
                          ) : (
                            <Text key={i}>{seg.text}</Text>
                          )
                        )}
                        {!props.values.body_text ? " " : ""}
                      </Text>
                      <TextInput
                        style={[globalStyles.postTextInput, styles.transparentInputText]}
                        multiline={true}
                        placeholder="Enter text"
                        onChangeText={props.handleChange("body_text")}
                        value={props.values.body_text}
                        cursorColor="#2482AA"
                        selectionColor="#2482AA55"
                      />
                    </View>
                    {pickedImage && <Image style={globalStyles.squareImageContainer} source={{ uri: pickedImage.uri }} />}
                    {pickedFile && <Text style={globalStyles.captionError}>{pickedFile.name}</Text>}
                  </View>
                  <ErrorMessage name="body_text" render={msg => <Text style={globalStyles.captionError}>{msg}</Text>} />

                  <View style={styles.buttonRow}>
                    <TouchableOpacity onPress={pickedImage ? resetApp : pickImage} style={styles.iconButton}>
                      <MaterialIcon name={pickedImage ? "no-photography" : "add-a-photo"} size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickedFile ? resetFile : pickFile} style={styles.iconButton}>
                      <MaterialIcon name={pickedFile ? "edit-document" : "attach-file"} size={30} color="#fff" />
                    </TouchableOpacity>
                      {/* link button (add) — tap to add another link; long-press to clear all */}
                    <TouchableOpacity
                      onPress={() => setLinkModalVisible(true)}
                      onLongPress={pickedLinks.length > 0 ? clearAllLinks : undefined}
                      style={[styles.iconButton, pickedLinks.length > 0 && { backgroundColor: "#e07b00" }]}
                    >
                      <MaterialIcon name="add-link" size={30} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.submitButton} onPress={props.handleSubmit}>
                      <Text style={globalStyles.primaryButtonText}>Create Post</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  formWrapper: { minWidth: 300, width: "90%", marginBottom: 400 },
  buttonRow: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 12, width: "100%", flexWrap: "wrap",gap: 20 },
  iconButton: { backgroundColor: "#2482AA", padding: 10, borderRadius: 20 },
  submitButton: { backgroundColor: "#2482AA", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 20, width: "35%", alignItems: "center" },
  linkPreview:  { fontSize: 12, color: "#555", marginTop: 6 },
  

// Overlay layer: the underlying TextInput's text is set to transparent,
// leaving only the cursor visible. On top, an identical layer of text
// content is overlaid, with the link segment colored blue and underlined.
// Since both layers contain exactly the same text (no hidden characters),
// the line-wrapping and cursor position stay aligned.

  postInputWrapper: { position: "relative", width: "100%" },
  overlayText: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    color: "#050505",
  },
  transparentInputText: {
    color: "transparent",
  },
  inlineLinkText: {
    color: "#2482AA",
    textDecorationLine: "underline",
  },

  // Modal
modalOverlay:   { flex: 1, backgroundColor: "rgba(0,0,0,0.2)", justifyContent: "center", alignItems: "center" },
modalBox:       { backgroundColor: "#fff", borderRadius: 12, padding: 16, width: "100%", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 },
modalRow:       { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 10, paddingHorizontal: 8 },
modalIcon:      { marginRight: 8 },
modalRowInput:  { flex: 1, paddingVertical: 10, fontSize: 15 },
modalApplyText: { color: "#2482AA", fontSize: 15, paddingHorizontal: 6 },

});
