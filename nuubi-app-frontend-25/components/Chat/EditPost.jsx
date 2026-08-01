import * as React from "react";
import { API_URL } from "../../config";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  StatusBar,
  ScrollView,
  Platform,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
const { createPostSchema } = require("../validationSchema");
import * as ImagePicker from "expo-image-picker";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import * as SecureStore from "expo-secure-store";
import FAIcon from "@expo/vector-icons/FontAwesome";

// Body_text coming from the server has links already converted to markdown
// syntax, e.g. "youtube: [youtube](https://www.youtube.com/)". Editing raw
// markdown is unfriendly, so for display we strip it back down to just the
// display text (matching what CreatePost shows while typing), and remember
// the extracted {text, url} pairs so we can re-wrap them into markdown again
// on save — without this, saving would silently drop every link.
function extractLinksAndPlainText(markdownText) {
  const text = markdownText || "";
  const regex = /\[([^\]]+)\]\(https?:\/\/[^\s)]+\)/g;
  const links = [];
  let plain = "";
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    plain += text.slice(lastIndex, match.index);
    const displayText = match[1];
    const url = match[0].slice(match[0].indexOf("(") + 1, -1);
    plain += displayText;
    links.push({ text: displayText, url });
    lastIndex = match.index + match[0].length;
  }
  plain += text.slice(lastIndex);
  return { plain, links };
}
 
// The reverse of the above: given the (possibly-edited) plain display text
// and the links extracted when the post was loaded, re-wrap each link's
// display text back into [text](url) markdown for saving. Uses the same
// "first-occurrence, sorted, overlap-dropped, insert right-to-left" approach
// as CreatePost, so duplicate/overlapping link text can never nest markdown.
function reapplyLinks(plainText, links) {
  if (!links || links.length === 0) return plainText;
  let result = plainText;
  const matches = [];
  links.forEach((link) => {
    const idx = result.indexOf(link.text);
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
  for (let i = merged.length - 1; i >= 0; i--) {
    const m = merged[i];
    const displayText = result.slice(m.start, m.end);
    const markdownLink = `[${displayText}](${m.url})`;
    result = result.slice(0, m.start) + markdownLink + result.slice(m.end);
  }
  return result;
}
 
// ── Helper: split body_text into segments based on each link's display text ──
// Same approach as CreatePost: find the first occurrence of each link's text,
// sort, drop overlaps, and split into "before / link / between / ... / after"
// segments. Since the extracted text is character-for-character identical to
// the original, the overlay layer and the underlying TextInput's actual text
// stay aligned in length and line-wrapping, so the cursor position never drifts.
function getDisplaySegments(text, links) {
  if (!links || links.length === 0 || !text) return [{ text: text || "", isLink: false }];
 
  const matches = [];
  links.forEach((link) => {
    const idx = text.indexOf(link.text);
    if (idx !== -1) matches.push({ start: idx, end: idx + link.text.length });
  });
  if (matches.length === 0) return [{ text, isLink: false }];
 
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

export default function EditPostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [status, setStatus] = React.useState(null);
  const [statusColor, setStatusColor] = React.useState(globalStyles.captionError);
  const [pickedImage, setPickedImage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  
  // Don't trust user.post_title / user.post_body — they're global context
  // values that can go stale (e.g. left over from a previously-viewed post,
  // or reset on a page refresh when arriving here via a direct URL like
  // /Home Page/EditPost). Always re-fetch this exact post's current data
  // from the server, keyed off its id, the same way ViewPostScreen does.
  const [postData, setPostData] = React.useState({
    title: "",
    body_text: "",
    image_url: null,
    file_url: null,
    file_name: null,
  });
  const [fetchingPost, setFetchingPost] = React.useState(true);
  const [pickedLinks, setPickedLinks] = React.useState([]); // [{ text, url }] extracted from markdown, for re-wrapping on save
 
  React.useEffect(() => {
    let cancelled = false;
    const fetchPost = async () => {
      setFetchingPost(true);
      try {
        const token = Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : sessionStorage.getItem("token");
        const res = await fetch(`${API_URL}/groups/getpostinfo`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user, currentPost: user.currentPost }),
        });
        const data = await res.json();
        if (!cancelled) {
          const { plain, links } = extractLinksAndPlainText(data.body_text ?? "");
          setPostData({
            title: data.post_title ?? "",
            body_text: plain,
            image_url: data.image_url || null,
            file_url: data.file_url || null,
            file_name: data.file_name || null,
          });
          setPickedLinks(links);
        }
      } catch (error) {
        console.error("Error fetching post to edit:", error);
      } finally {
        if (!cancelled) setFetchingPost(false);
      }
    };
    if (user.currentPost) fetchPost();
    return () => { cancelled = true; };
  }, [user.currentPost]);

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
      });
      setPostData((p) => ({ ...p, image_url: result.assets[0].uri }));
    }
  };

  const resetApp = () => {
    setPickedImage(null);
    setPostData((p) => ({ ...p, image_url: null }));
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={globalStyles.h3HeadingWhite}>Edit Post</Text>,
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Updating your post...</Text>
        </View>
      )}
     {fetchingPost ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
          <ActivityIndicator size="large" color="#2482AA" />
          <Text style={{ marginTop: 10, color: "#767676" }}>Loading post...</Text>
        </View>
      ) : (
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
              enableReinitialize
              initialValues={{
                title: postData.title,
                body_text: postData.body_text,
              }}
              validationSchema={createPostSchema}
              onSubmit={async (values, actions) => {
                setLoading(true);
                try {
                  let imageUrl = postData.image_url;
                  if (pickedImage) {
                    imageUrl = await uploadToS3(pickedImage.uri, `edit-img-${Date.now()}.jpg`, "image/jpeg");
                  }

                  // The textbox shows plain display text (e.g. "youtube"), not
                  // markdown — reapply the links extracted on load so the
                  // saved body_text keeps [text](url) syntax, same as CreatePost.
                  const finalBodyText = reapplyLinks(values.body_text, pickedLinks);

                  const token = Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : sessionStorage.getItem("token");
                  const res = await fetch(`${API_URL}/groups/editpost`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({
                    ...user,
                    currentPost: user.currentPost,
                    ...values,
                    body_text: finalBodyText,
                    imageUrl,
                    image_url: imageUrl,
                    file_url: postData.file_url,
                    file_name: postData.file_name,
                  }),
                    credentials: "include",
                    body: JSON.stringify({ ...user, ...values, imageUrl }),
                  });

                  if (!res.ok) throw new Error("Post update failed");
                  const data = await res.json();
                  setUser({ ...data });
                  setStatus(data.status || "Post updated successfully");
                  setStatusColor(globalStyles.captionErrorSuccess);
                } catch (error) {
                  console.error(error);
                  setStatus("Error updating post");
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
                      {/* Overlay: colors the text segment corresponding to each
                       applied link blue with an underline, visually displaying
                       it as a clickable hyperlink style, layered on top of the
                       typing area — same approach as CreatePost. */}
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
                    {postData.image_url && (
                      <Image
                        style={{ borderRadius: 10, width: 250, height: 250, marginVertical: 10, alignSelf: "center" }}
                        source={{ uri: postData.image_url }}
                      />
                    )}
                    {postData.file_url && (
                      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                        <FAIcon name="file" size={20} color="#2482AA" />
                        <Text style={{ marginLeft: 10, color: "#2482AA" }}>{postData.file_name || "Attached file"}</Text>
                      </View>
                    )}
                  </View>
                  <ErrorMessage name="body_text" render={msg => <Text style={globalStyles.captionError}>{msg}</Text>} />
 
                  <View style={styles.buttonRow}>
                    <TouchableOpacity onPress={postData.image_url ? resetApp : pickImage} style={styles.iconButton}>
                      <MaterialIcon name={postData.image_url ? "no-photography" : "add-a-photo"} size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitButton} onPress={props.handleSubmit}>
                      <Text style={globalStyles.primaryButtonText}>Update Post</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
      )} 
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
  buttonRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: 12 },
  iconButton: { backgroundColor: "#2482AA", padding: 10, borderRadius: 20 },
  submitButton: { backgroundColor: "#2482AA", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 20, width: "70%", alignItems: "center" },
  
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
});
