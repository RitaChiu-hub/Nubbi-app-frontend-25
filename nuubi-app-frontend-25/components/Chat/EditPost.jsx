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

export default function EditPostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [status, setStatus] = React.useState(null);
  const [statusColor, setStatusColor] = React.useState(
    globalStyles.captionError,
  );
  const [pickedImage, setPickedImage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const getS3PresignedUrl = async (fileName, fileType) => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
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
      const { uploadUrl, fileUrl } = await getS3PresignedUrl(
        fileName,
        fileType,
      );
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
      setUser({ ...user, image_url: result.assets[0].uri });
    }
  };

  const resetApp = () => {
    setPickedImage(null);
    setUser({ ...user, image_url: null });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Edit Post</Text>
      ),
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
      <ScrollView style={{ backgroundColor: "#fbfbfb" }}>
        {Platform.OS === "web" && (
          <TouchableOpacity
            onPress={navigation.goBack}
            style={styles.backButton}
          >
            <FAIcon name="chevron-left" size={16} color="#2482AA" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
        <View style={styles.container}>
          <View style={styles.formWrapper}>
            <Formik
              initialValues={{
                title: user.post_title,
                body_text: user.post_body,
              }}
              validationSchema={createPostSchema}
              onSubmit={async (values, actions) => {
                setLoading(true);
                try {
                  let imageUrl = user.image_url;

                  if (pickedImage) {
                    imageUrl = await uploadToS3(
                      pickedImage.uri,
                      `edit-img-${Date.now()}.jpg`,
                      "image/jpeg",
                    );
                  }

                  const token =
                    Platform.OS !== "web"
                      ? await SecureStore.getItemAsync("token")
                      : sessionStorage.getItem("token");
                  const res = await fetch(`${API_URL}/groups/editpost`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
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
                  <ErrorMessage
                    name="title"
                    render={(msg) => (
                      <Text style={globalStyles.captionError}>{msg}</Text>
                    )}
                  />

                  <Text style={globalStyles.textInputLabel}>Post</Text>
                  <View style={globalStyles.postContainer}>
                    <TextInput
                      style={globalStyles.postTextInput}
                      multiline={true}
                      placeholder="Enter text"
                      onChangeText={props.handleChange("body_text")}
                      value={props.values.body_text}
                    />
                    {user.image_url && (
                      <Image
                        style={{
                          borderRadius: 10,
                          width: 250,
                          height: 250,
                          marginVertical: 10,
                          alignSelf: "center",
                        }}
                        source={{ uri: user.image_url }}
                      />
                    )}
                    {user.file_url && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 10,
                        }}
                      >
                        <FAIcon name="file" size={20} color="#2482AA" />
                        <Text style={{ marginLeft: 10, color: "#2482AA" }}>
                          {user.file_name || "Attached file"}
                        </Text>
                      </View>
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
                      onPress={user.image_url ? resetApp : pickImage}
                      style={styles.iconButton}
                    >
                      <MaterialIcon
                        name={user.image_url ? "no-photography" : "add-a-photo"}
                        size={30}
                        color="#fff"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={props.handleSubmit}
                    >
                      <Text style={globalStyles.primaryButtonText}>
                        Update Post
                      </Text>
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 12,
  },
  iconButton: { backgroundColor: "#2482AA", padding: 10, borderRadius: 20 },
  submitButton: {
    backgroundColor: "#2482AA",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "70%",
    alignItems: "center",
  },
});
