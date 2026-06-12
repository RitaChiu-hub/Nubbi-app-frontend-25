import * as React from "react";
import { API_URL } from "../../config";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { globalStyles } from "../../styles/global";
import * as ImagePicker from "expo-image-picker";
import { AccountContext } from "../AccountContext";
import * as ImageManipulator from "expo-image-manipulator";
import { useAssets } from "expo-asset";
import FeatherIcon from "@expo/vector-icons/FontAwesome6";
import * as SecureStore from "expo-secure-store";

export default function ProfilePageScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [pickedImage, setPickedImage] = React.useState(null);
  const [avatarInfo, setAvatarInfo] = React.useState(null);
  const [userPoints, setUserPoints] = React.useState(0);
  const [myUsername, setMyUsername] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  let assets1 = useAssets([require("../../assets/defaultAvatar.png")]);

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

  const getUserPoints = async () => {
    const token = Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : sessionStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/groups/getuserpoints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...user }),
      });
      const jsonData = await response.json();
      setUserPoints(jsonData.userPoints);
      setMyUsername(jsonData.username);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getUserAvatar = async () => {
    const token = Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : sessionStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/settings/getuseravatar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...user }),
      });
      const jsonData = await response.json();
      setAvatarInfo(jsonData.avatar_url);
    } catch (err) {
      console.error(err.message);
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

  const resetImage = () => setPickedImage(null);

  const saveAvatar = async () => {
    setLoading(true);
    try {
      const fileName = `avatar-${user.id}-${Date.now()}.jpg`;
      const imageUrl = await uploadToS3(pickedImage.uri, fileName, "image/jpeg");
      
      const token = Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : sessionStorage.getItem("token");
      const res = await fetch(`${API_URL}/settings/updateavatar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...user, imageUrl }),
      });

      if (!res.ok) throw new Error("Avatar update failed");
      const data = await res.json();
      setUser({ ...data });
      setPickedImage(null);
      if (data.status) setError(data.status);
    } catch (error) {
      console.error(error);
      setError("Error updating avatar");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getUserPoints();
    getUserAvatar();
  }, []);

  React.useEffect(() => {
    getUserAvatar();
    resetImage();
  }, [user]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Profile",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    // Main landmark for My Profile, helping screen reader users access the primary content area.
    <View role="main" aria-label="My Profile main content" style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <ScrollView style={{ backgroundColor: "#fbfbfb" }}>
        <View style={styles.container}>
          <Text style={globalStyles.captionError}>{error}</Text>
          <View>
            {avatarInfo !== null && pickedImage === null ? (
              <Image style={globalStyles.roundImageContainer} source={{ uri: avatarInfo }} />
            ) : pickedImage !== null ? (
              <Image style={globalStyles.roundImageContainer} source={{ uri: pickedImage.uri }} />
            ) : (
              <Image
                style={globalStyles.roundImageContainer}
                source={Platform.OS == "web" ? require("../../assets/defaultAvatar.png") : assets1[0]}
              />
            )}
          </View>

          <Text style={[globalStyles.h2HeadingMedium, { textAlign: "center" }]}>Hi {myUsername}!</Text>
          <Text style={[globalStyles.bodyRegular, { marginBottom: 20 }]}>You have {userPoints} total points 🎉</Text>
          
          <View style={globalStyles.widthContainer}>
            <View style={globalStyles.sectionBody}>
              <View style={[globalStyles.rowWrapper, globalStyles.rowFirst]}>
                <TouchableOpacity onPress={pickedImage ? resetImage : pickImage} style={globalStyles.row}>
                  <View style={globalStyles.row}>
                    <FeatherIcon color="#616161" solid name={pickedImage ? "user-xmark" : "user-pen"} style={globalStyles.rowIcon} size={22} />
                    <Text style={globalStyles.headingTextRows}>{pickedImage ? "Cancel Update" : "Update Avatar"}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {pickedImage && (
                <View style={globalStyles.rowWrapper}>
                  <TouchableOpacity style={globalStyles.row} onPress={saveAvatar}>
                    <View style={globalStyles.row}>
                      <FeatherIcon color="#616161" solid name="user-lock" style={globalStyles.rowIcon} size={22} />
                      <Text style={globalStyles.headingTextRows}>Save Avatar</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity style={globalStyles.rowWrapper} onPress={() => navigation.navigate("FeedbackScreen")}>
                <View style={globalStyles.row}>
                  <FeatherIcon color="#616161" solid name="paper-plane" style={globalStyles.rowIcon} size={22} />
                  <Text style={globalStyles.headingTextRows}>Contact Us</Text>
                </View>
                <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
              </TouchableOpacity>

              <TouchableOpacity style={globalStyles.rowWrapper} onPress={() => navigation.navigate("HelpLoggedIn")}>
                <View style={globalStyles.row}>
                  <FeatherIcon color="#616161" solid name="circle-question" style={globalStyles.rowIcon} size={22} />
                  <Text style={globalStyles.headingTextRows}>Nuubi FAQ</Text>
                </View>
                <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
              </TouchableOpacity>

              <TouchableOpacity style={[globalStyles.rowWrapper, globalStyles.rowLast]} onPress={() => navigation.navigate("Settings")}>
                <View style={globalStyles.row}>
                  <FeatherIcon color="#616161" solid name="gear" style={globalStyles.rowIcon} size={22} />
                  <Text style={globalStyles.headingTextRows}>Settings</Text>
                </View>
                <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  container: { flex: 1, backgroundColor: "#fbfbfb", alignItems: "center", marginTop: 12 },
});
