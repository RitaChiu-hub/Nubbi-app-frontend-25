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

export default function CreatePostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [status, setStatus] = React.useState(null);
  const [formKey, setFormKey] = React.useState(Date.now());
  const [statusColor, setStatusColor] = React.useState(globalStyles.captionError);
  const [pickedImage, setPickedImage] = React.useState(null);
  const [pickedFile, setPickedFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setFormKey(Date.now());
      setStatus(null);
      setPickedImage(null);
      setPickedFile(null);
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
              initialValues={{ title: "", body_text: "" }}
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
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
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
  buttonRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: 12 },
  iconButton: { backgroundColor: "#2482AA", padding: 10, borderRadius: 20 },
  submitButton: { backgroundColor: "#2482AA", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 20, width: "60%", alignItems: "center" },
});
