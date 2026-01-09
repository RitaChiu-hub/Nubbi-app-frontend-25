import * as React from "react";
import { API_URL } from "../../config";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Dimensions,
  Linking,
} from "react-native";
import { useAssets } from "expo-asset";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import socket from "../../socket";
const { addCommentSchema } = require("../validationSchema");
import moment from "moment";
import { useHeaderHeight } from "@react-navigation/elements";
import FeatherIcon from "@expo/vector-icons/Feather";
import alert from "./../alert";
import FAIcon from "@expo/vector-icons/FontAwesome";
import * as SecureStore from "expo-secure-store";
import { useIsFocused } from "@react-navigation/native";
import Markdown from "react-native-markdown-display";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../config";
import sessionService from "../../services/sessionService";
import * as ImagePicker from "expo-image-picker";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import * as ImageManipulator from "expo-image-manipulator";

const cloudName = "dvvdc9evd";
const apiKey = "971765162862783";

export default function ViewPostScreen({ navigation, route }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const { user, setUser } = React.useContext(AccountContext);
  const [comments, setComments] = React.useState([]);
  const [postPoints, setPostPoints] = React.useState(0);
  const [postInfo, setPostInfo] = React.useState({
    post_title: "loading",
    body_text: "loading",
    post_author: "loading",
    image_url: null,
    file_url: null,
    file_name: null,
    iso_time_sent: "2000-01-01T01:00:00.000000",
  });
  const [likes, setLikes] = React.useState([]);
  const [isChanged, setIsChanged] = React.useState(false);
  const [postLiked, setPostLiked] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState(null);
  const height = useHeaderHeight();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [previewUrls, setPreviewUrls] = React.useState([]);
  const [myUsername, setMyUsername] = React.useState("");
  const isFocused = useIsFocused();
  const postId = route.params?.currentPost ?? user.currentPost ?? null;
  const [loading, setLoading] = React.useState(true);
  const [loadedPostId, setLoadedPostId] = React.useState(null);
  const deviceWidth = Dimensions.get("window").width;
  // Note: Post view deduplication is now handled in sessionService
  // This ref is kept for backward compatibility but sessionService handles deduplication

  const scrollViewRef = React.useRef();

  // State for comment image upload
  const [commentImage, setCommentImage] = React.useState(null);
  const [commentImageError, setCommentImageError] = React.useState("");
  const [imageModalVisible, setImageModalVisible] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);

  let assets1 = useAssets([require("../../assets/defaultAvatar.png")]);

  const getPostLiked = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_URL}/groups/getpostliked`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setPostLiked(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getLikes = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_URL}/groups/getcommentlikes`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      const myLikes =
        jsonData.length > 0
          ? [...new Set(jsonData.map((item) => item.comment_id))]
          : [];
      setLikes(myLikes);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getPostInfo = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_URL}/groups/getpostinfo`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setPostInfo({
        ...jsonData,
        file_name: jsonData.file_name || null,
      });
      if (jsonData.file_url !== null) {
        const parts = jsonData.file_url.split("upload/");
        const jpgPart2 = parts[2].split("pdf");
        setPreviewUrl(
          parts[0] +
            "upload/pg_1,q_100/" +
            parts[1] +
            "upload/" +
            jpgPart2[0] +
            "jpg"
        );

        //  const totalPages = 3; // Change this to the total number of pages in your PDF
        const totalPages = jsonData.filePages;
        const urls = [];
        for (let i = 1; i <= totalPages; i++) {
          urls.push(
            parts[0] +
              `upload/pg_${i},q_100/` +
              parts[1] +
              "upload/" +
              jpgPart2[0] +
              "jpg"
          );
        }
        setPreviewUrls(urls);
      } else {
        null;
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getPostPoints = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_URL}/groups/getpostpoints`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setPostPoints(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getComments = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    const vals = { ...user, currentPost: route.params.currentPost };
    try {
      const response = await fetch(
        `${API_URL}/groups/getpostcomments`,
        //  `${API_URL}/groups/getpostcomments`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...vals }),
        }
      );
      const jsonData = await response.json();
      jsonData.sort(
        (a, b) =>
          new Date(a.comment_iso_time_sent) - new Date(b.comment_iso_time_sent)
      );
      //   console.log("COMMENTS:", JSON.stringify(jsonData, null, 2));
      setComments(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const mono = Platform.select({
    ios: "Courier",
    android: "monospace",
    web: "monospace",
    default: "Courier",
  });

  const getUserPoints = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_URL}/groups/getuserpoints`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setMyUsername(jsonData.username);
    } catch (err) {
      console.error(err.message);
    }
  };

  const resizeCommentImage = async (imageInfo, resizeAmount) => {
    const resizedPhoto = await ImageManipulator.manipulateAsync(
      imageInfo.uri,
      [{ resize: { width: imageInfo.width * resizeAmount } }],
      { compress: 0.7, format: "jpeg", base64: true }
    );

    setCommentImage({
      uri: resizedPhoto.uri,
      base64: resizedPhoto.base64,
    });

    const fileImg = await fetch(resizedPhoto.uri).then((r) => r.blob());
    if (fileImg.size > 5242880) {
      // 5MB limit for comments
      resizeCommentImage(imageInfo, resizeAmount * 0.5);
    }
  };

  const pickCommentImage = async () => {
    setCommentImageError("");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const imageAsset = result.assets[0];
      
      // Validate file type
      const uri = imageAsset.uri;
      const fileExtension = uri.split('.').pop().toLowerCase();
      if (!['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        setCommentImageError("Only JPEG, PNG, and GIF images are supported");
        return;
      }

      // Validate file size (5MB limit)
      if (imageAsset.fileSize > 5242880) {
        resizeCommentImage(imageAsset, 0.5);
      } else {
        setCommentImage({
          uri: imageAsset.uri,
          base64: imageAsset.base64,
          width: imageAsset.width,
        });
      }
    }
  };

  const removeCommentImage = () => {
    setCommentImage(null);
    setCommentImageError("");
  };

  // React.useEffect(() => {
  //   if (!postId) return;
  //   setLoading(true);
  //   setLoadedPostId(null);
  //   getPostInfo();
  //   getComments();
  //   getPostPoints();
  //   getLikes();
  //   getPostLiked();
  //   getUserPoints();
  // }, [postId]);

  React.useEffect(() => {
    if (!postId) return;

    // instant reset so old content never renders
    setLoading(true);
    setLoadedPostId(null);
    setPostInfo({
      post_title: "",
      body_text: "",
      post_author: "",
      image_url: null,
      file_url: null,
      file_name: null,
      iso_time_sent: "2000-01-01T01:00:00.000Z",
    });
    setComments([]);
    setLikes([]);
    setPostLiked(false);
    setPostPoints(0);
    setPreviewUrl(null);
    setPreviewUrls([]);

    const controller = new AbortController();

    Promise.all([
      getPostInfo(postId, controller.signal),
      getComments(postId, controller.signal),
      getPostPoints(postId, controller.signal),
      getLikes(controller.signal),
      getPostLiked(controller.signal),
      getUserPoints(controller.signal),
    ]).finally(() => {
      if (!controller.signal.aborted) {
        setLoadedPostId(postId);
        setLoading(false);
        
        // Track post view (deduplication handled in sessionService)
        if (postId) {
          sessionService.trackPostView(postId).catch((error) => {
            console.error("Error tracking post view:", error);
          });
        }
      }
    });

    return () => controller.abort();
  }, [postId]);

  const isAuthor = myUsername === user.post_author ? true : false;

  React.useEffect(() => {
    const room = `post-${user.currentPost}`;
    socket.emit("join", room);
  }, [user.currentPost]);

  React.useEffect(() => {
    socket.on("insert comment return updated list", (newComment) => {
      setComments((prev) => [
        ...prev,
        {
          ...newComment,
          comment_points: 0,
        },
      ]);
    });
    return () => {
      socket.off("insert comment return updated list");
    };
  }, []);
  // React.useEffect(() => {
  //   socket.on("insert comment return updated list", (rows) => {
  //     const sorted = rows.sort(
  //       (a, b) =>
  //         new Date(a.comment_iso_time_sent) - new Date(b.comment_iso_time_sent)
  //     );
  //     setComments(sorted);
  //   });
  //   return () => {
  //     socket.off("insert comment return updated list");
  //   };
  // }, []);

  // React.useEffect(() => {
  //   const handleUpdate = (jsonData) => {
  //     const sorted = [...jsonData].sort(
  //       (a, b) =>
  //         new Date(a.comment_iso_time_sent) - new Date(b.comment_iso_time_sent)
  //     );
  //     setComments(sorted);
  //     getComments();
  //   };

  //   socket.on("insert comment return updated list", handleUpdate);

  //   // Cleanup to prevent multiple listeners stacking
  //   return () => {
  //     socket.off("insert comment return updated list", handleUpdate);
  //   };
  // }, [user.currentPost, socket]);

  // React.useEffect(() => {
  //   socket.on("insert comment return updated list", (jsonData) => {
  //     const sorted = [...jsonData].sort(
  //       (a, b) =>
  //         new Date(a.comment_iso_time_sent) - new Date(b.comment_iso_time_sent)
  //     );
  //     setComments(sorted);
  //   });
  // }, [socket]);

  React.useEffect(() => {
    socket.on("add post point return updated sum", (jsonData) => {
      setPostPoints(jsonData);
      getPostPoints();
    });
  }, [socket]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>View Post</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const KeyboardBehavior = Platform.OS === "android" ? "false" : "padding";

  if (loading || loadedPostId !== postId) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fbfbfb",
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading post…</Text>
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      behavior={KeyboardBehavior}
      keyboardVerticalOffset={height}
      style={{
        flex: 1,
        backgroundColor: "#fbfbfb",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* ⬅️ Back button at the very top */}
      {Platform.OS === "web" && (
        <TouchableOpacity
          onPress={navigation.goBack}
          accessibilityRole="button"
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: 16,
            paddingVertical: 8,
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
          }}
        >
          <FAIcon
            name="chevron-left"
            size={16}
            color="#2482AA"
            style={{ marginRight: 4 }}
          />
          <Text
            style={{
              color: "#2482AA",
              fontSize: 18,
              fontFamily: "Poppins_600SemiBold",
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
      )}
      <ScrollView
        ref={scrollViewRef}
        // onContentSizeChange={() =>
        //   scrollViewRef.current?.scrollToEnd({ animated: true })
        // }
      >
        {/* Modal for viewing comment images */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={imageModalVisible}
          onRequestClose={() => setImageModalVisible(false)}
        >
          <View style={globalStyles.centeredView}>
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.9)",
              }}
              onPress={() => setImageModalVisible(false)}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {selectedImage && (
                  <Image
                    style={{
                      width: deviceWidth > 800 ? 600 : deviceWidth * 0.9,
                      height: deviceWidth > 800 ? 600 : deviceWidth * 0.9,
                      resizeMode: "contain",
                    }}
                    source={{ uri: selectedImage }}
                  />
                )}
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    paddingVertical: 12,
                    paddingHorizontal: 30,
                    borderRadius: 60,
                    backgroundColor: "#2482AA",
                  }}
                  onPress={() => setImageModalVisible(false)}
                >
                  <Text style={globalStyles.primaryButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={globalStyles.centeredView}>
            <View style={globalStyles.modalView}>
              <ScrollView>
                {previewUrls.map((url, index) => (
                  <Image
                    key={index}
                    style={{
                      borderRadius: 10,
                      width: deviceWidth > 800 ? 500 : deviceWidth * 0.7,
                      height: deviceWidth > 800 ? 700 : deviceWidth * 0.8,
                      maxWidth: Dimensions.get("window").width * 0.6,
                      maxHeight: Dimensions.get("window").height * 0.7,
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: 10,
                      marginHorizontal: 10,
                    }}
                    source={{ uri: url }}
                  />
                ))}
              </ScrollView>
              <View style={{ paddingVertical: 10 }}></View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  width: "100%",
                }}
                accessibilityRole="none"
              >
                <TouchableOpacity
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 30,
                    borderRadius: 60,
                    elevation: 3,
                    backgroundColor: "#2482AA",
                  }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={globalStyles.primaryButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 30,
                    borderRadius: 60,
                    elevation: 3,
                    backgroundColor: "#2482AA",
                  }}
                  onPress={() => Linking.openURL(postInfo.file_url)}
                  //   onPress={() => alert("File Downloads are coming soon!")}
                >
                  <FeatherIcon name="download" color="#fbfbfb" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View
          style={{
            padding: 10,
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              alignContent: "center",
              borderRadius: 16,
              borderColor: "#ddd",
              backgroundColor: "#fbfbfb",
              elevation: 15,
              shadowColor: "#333333",
              shadowOpacity: 0.5,
              shadowRadius: 2,
              shadowOffset: {
                width: 0.8,
                height: 0.8,
              },
              overflow: "visible",
              width: deviceWidth > 500 ? deviceWidth * 0.75 : deviceWidth * 0.9,
            }}
          >
            <View
              style={{
                width: "100%",
                alignContent: "center",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Text style={globalStyles.h3HeadingRegular}>{postPoints}</Text>

                <TouchableOpacity
                  onPress={async () => {
                    if (postLiked != true) {
                      setPostPoints(postPoints + 1);
                      setPostLiked(!postLiked);
                    } else {
                      setPostPoints(postPoints - 1);
                      setPostLiked(!postLiked);
                    }
                    const token =
                      Platform.OS !== "web"
                        ? await SecureStore.getItemAsync("token")
                        : null; // Get token only on mobile

                    fetch(
                      `${API_URL}/groups/addpostpoint`,
                      {
                        method: "POST",
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                          ...(token
                            ? { Authorization: `Bearer ${token}` }
                            : {}),
                        },
                        body: JSON.stringify({
                          ...user,
                        }),
                      }
                    );
                  }}
                >
                  <Text
                    style={[
                      globalStyles.h3HeadingRegular,
                      { color: postLiked ? "#2482AA" : "#bbb" },
                    ]}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginLeft: 10 }}></View>

              <Text
                style={[
                  globalStyles.h3HeadingRegular,
                  {
                    flexShrink: 1,
                    flexWrap: "wrap",
                    maxWidth:
                      deviceWidth > 500
                        ? deviceWidth * 0.65
                        : deviceWidth * 0.75,
                  },
                ]}
              >
                {postInfo.post_title}
              </Text>
              {/* <Text style={globalStyles.h3HeadingRegular}>
                {postInfo.post_title}
              </Text> */}
            </View>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 14,
                }}
              >
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 20,
                    //marginRight: 10,
                  }}
                  source={
                    postInfo?.avatar_url
                      ? { uri: postInfo.avatar_url }
                      : Platform.OS === "web"
                      ? require("../../assets/defaultAvatar.png")
                      : assets1[0]
                  }
                />
                <Text style={[globalStyles.bodyRegular, { padding: 14 }]}>
                  Author: {postInfo.post_author}
                </Text>
              </View>
              <View style={{ padding: 14 }}>
                {/* <Text style={[globalStyles.bodyRegular, { padding: 14 }]}> */}
                <Markdown
                  style={{
                    body: {
                      fontFamily: "Poppins_400Regular",
                      fontSize: 14,
                      color: "#050505",
                    },
                    strong: { fontFamily: "Poppins_600SemiBold" }, // **bold**
                    em: { fontStyle: "italic" }, // *italic*
                    link: { color: "#2482AA" },
                    // bullet & numbered lists share the same left indent
                    bullet_list: { paddingLeft: 8 },
                    ordered_list: { paddingLeft: 8 },
                    list_item: { marginVertical: 2 },

                    // block quotes
                    block_quote: {
                      borderLeftWidth: 3,
                      borderLeftColor: "#7DDFA0",
                      paddingLeft: 8,
                      fontStyle: "italic",
                      color: "#555",
                    },

                    // inline `code`
                    code_inline: {
                      backgroundColor: "#f1f1f1",
                      borderRadius: 4,
                      fontFamily: mono,
                      fontSize: 13, // shrink text
                      paddingHorizontal: 4, // reduce side padding
                      paddingVertical: 2, // add small vertical padding
                      marginHorizontal: 2, // tiny gaps between code and text
                      flexShrink: 1, // allow it to shrink
                      flexWrap: "wrap", // wrap long bits onto next line
                      alignSelf: "flex-start", // don’t stretch to full width
                    },

                    // fenced ```code blocks```
                    fence: {
                      backgroundColor: "#f9f9f9e9",
                      borderRadius: 6,
                      fontFamily: mono,
                      fontSize: 13, // shrink text
                      padding: 8, // keep a little padding
                      marginVertical: 8, // space above/below block
                      maxWidth: deviceWidth * 0.95, // never wider than screen
                      overflow: "scroll", // horizontal scroll if needed
                    },
                    code_block: {
                      backgroundColor: "#f9f9f9",
                      borderRadius: 6,
                      fontFamily: mono,
                      fontSize: 13,
                      padding: 8,
                      marginVertical: 8,
                      flexShrink: 1,
                      width: "100%",
                      overflow: "hidden",
                    },
                  }}
                >
                  {postInfo.body_text}
                </Markdown>
              </View>
              {/* </Text> */}
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {postInfo.image_url === null ? null : (
                  <Image
                    style={{
                      borderRadius: 10,
                      width: 250,
                      height: 250,
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: 10,
                    }}
                    source={{ uri: postInfo.image_url }}
                  />
                )}
              </View>

              {postInfo.file_url && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    marginTop: 10,
                  }}
                >
                  <Text style={globalStyles.caption}>Attached file: </Text>
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text
                      style={[globalStyles.captionLinkBlue, { marginLeft: 4 }]}
                    >
                      {postInfo.file_name || "View file"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "80%",
                  backgroundColor: "red",
                }}
              >
                {postInfo.file_url === null ? null : (
                  <View>
                    <View style={{ padding: 14 }}>
                      <Text style={globalStyles.caption}>Attached file: </Text>
                      <TouchableOpacity
                        accessibilityRole="button"
                        onPress={() => setModalVisible(true)}
                      >
                        <Text style={globalStyles.captionLinkBlue}>
                          {/* //   {postInfo.file_url} */}
              {/* {postInfo.file_name || "View File"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View> */}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                margin: 12,
              }}
            >
              <Text style={globalStyles.bodyRegular}>
                {moment(postInfo.iso_time_sent).calendar()}
              </Text>
              <View
                style={{
                  paddingHorizontal: 6,
                }}
              ></View>
              {isAuthor == true ? (
                <View>
                  <TouchableOpacity
                    style={globalStyles.smallRightButton}
                    onPress={() => {
                      setUser({
                        ...user,
                        post_title: postInfo.post_title,
                        post_body: postInfo.body_text,
                        post_author: postInfo.post_author,
                        image_url: postInfo.image_url,
                      }),
                        navigation.navigate("EditPost");
                    }}

                    //  onPress={() => navigation.navigate("EditPost")}
                  >
                    <Text style={globalStyles.primaryButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View></View>
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            //  width: "100%",
            width: deviceWidth > 500 ? deviceWidth * 0.75 : "100%",
            alignContent: "center",
            padding: 10,
            paddingLeft: 10,
          }}
        >
          <Text
            style={{
              color: "#050505",
              fontSize: 18,
              fontFamily: "Poppins_600SemiBold",
              paddingBottom: 10,
              paddingLeft: 4,
            }}
          >
            {user.number_comments}{" "}
            {user.number_comments === "1" ? "Comment:" : "Comments:"}
          </Text>
          {comments &&
            comments.map((comments) => {
              return (
                <View
                  key={comments.post_comment_id}
                  style={{
                    borderColor: "#ddd",
                    borderRadius: 16,
                    borderWidth: 1,
                    marginBottom: 10,
                    padding: 5,
                    paddingBottom: 10,
                    backgroundColor: "#fbfbfb",
                    borderColor: "#ddd",
                    elevation: 15,
                    shadowColor: "#333333",
                    shadowOpacity: 0.5,
                    shadowRadius: 2,
                    shadowOffset: {
                      width: 0.8,
                      height: 0.8,
                    },
                    overflow: "visible",
                    width:
                      deviceWidth > 500
                        ? deviceWidth * 0.75
                        : deviceWidth * 0.9,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingLeft: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {comments.comment_points}
                    </Text>
                    <TouchableOpacity
                      onPress={async () => {
                        if (!likes.includes(comments.post_comment_id)) {
                          likes.push(comments.post_comment_id);
                          setLikes(likes);
                          comments.comment_points++;
                          setIsChanged(!isChanged);
                        } else {
                          const index = likes.indexOf(comments.post_comment_id);
                          likes.splice(index, 1);
                          setLikes(likes);
                          comments.comment_points--;
                          setIsChanged(!isChanged);
                        }
                        const token =
                          Platform.OS !== "web"
                            ? await SecureStore.getItemAsync("token")
                            : null; // Get token only on mobile

                        fetch(
                          `${API_URL}/groups/addcommentpoint`,
                          {
                            method: "POST",
                            credentials: "include",
                            headers: {
                              "Content-Type": "application/json",
                              ...(token
                                ? { Authorization: `Bearer ${token}` }
                                : {}),
                            },
                            body: JSON.stringify({
                              ...user,
                              comment_id: comments.post_comment_id,
                            }),
                          }
                        );
                      }}
                    >
                      <Text
                        style={{
                          color: likes.includes(comments.post_comment_id)
                            ? "#228ee7"
                            : "#bbb",
                          fontSize: 16,
                          fontWeight: "bold",
                          paddingBottom: 2,
                        }}
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                    <Image
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 20,
                        marginLeft: 6,
                        //  paddingLeft: 8,
                      }}
                      source={
                        comments?.sender_avatar_url
                          ? { uri: comments.sender_avatar_url }
                          : Platform.OS === "web"
                          ? require("../../assets/defaultAvatar.png")
                          : assets1[0]
                      }
                    />
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#333",
                        paddingLeft: 5,
                      }}
                    >
                      {comments.sender_username}
                    </Text>
                    <View style={{ marginHorizontal: 2 }}></View>
                    <Text style={{ fontSize: 10, color: "grey" }}>
                      {moment(comments.comment_iso_time_sent).calendar()}
                    </Text>
                  </View>
                  <View style={{ paddingLeft: 4 }}>
                    <Markdown
                      style={{
                        body: {
                          fontFamily: "Poppins_400Regular",
                          fontSize: 14,
                          color: "#050505",
                        },
                        strong: { fontFamily: "Poppins_600SemiBold" }, // **bold**
                        em: { fontStyle: "italic" }, // *italic*
                        link: { color: "#2482AA" },
                        // bullet & numbered lists share the same left indent
                        bullet_list: { paddingLeft: 8 },
                        ordered_list: { paddingLeft: 8 },
                        list_item: { marginVertical: 2 },

                        // block quotes
                        block_quote: {
                          borderLeftWidth: 3,
                          borderLeftColor: "#7DDFA0",
                          paddingLeft: 8,
                          fontStyle: "italic",
                          color: "#555",
                        },

                        // inline `code`
                        code_inline: {
                          backgroundColor: "#f1f1f1",
                          borderRadius: 4,
                          fontFamily: mono,
                          fontSize: 13, // shrink text
                          paddingHorizontal: 4, // reduce side padding
                          paddingVertical: 2, // add small vertical padding
                          marginHorizontal: 2, // tiny gaps between code and text
                          flexShrink: 1, // allow it to shrink
                          flexWrap: "wrap", // wrap long bits onto next line
                          alignSelf: "flex-start", // don’t stretch to full width
                        },

                        // fenced ```code blocks```
                        fence: {
                          backgroundColor: "#f9f9f9",
                          borderRadius: 6,
                          fontFamily: mono,
                          fontSize: 13, // shrink text
                          padding: 8, // keep a little padding
                          marginVertical: 8, // space above/below block
                          maxWidth: deviceWidth * 0.95, // never wider than screen
                          overflow: "scroll", // horizontal scroll if needed
                        },
                        code_block: {
                          backgroundColor: "#f9f9f9",
                          borderRadius: 6,
                          fontFamily: mono,
                          fontSize: 13,
                          padding: 8,
                          marginVertical: 8,
                          flexShrink: 1,
                          width: "100%",
                          overflow: "hidden",
                        },
                      }}
                    >
                      {comments.comment_text}
                    </Markdown>
                    {comments.image_url && (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedImage(comments.image_url);
                          setImageModalVisible(true);
                        }}
                        style={{ marginTop: 8 }}
                      >
                        <Image
                          style={{
                            borderRadius: 8,
                            width: deviceWidth > 500 ? 200 : deviceWidth * 0.5,
                            height: deviceWidth > 500 ? 150 : deviceWidth * 0.4,
                            resizeMode: "cover",
                          }}
                          source={{ uri: comments.image_url }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
      <View
        style={{
          alignContent: "center",
          paddingBottom: 20,
          width: deviceWidth > 500 ? deviceWidth * 0.75 : deviceWidth * 0.9,
        }}
      >
        <Formik
          initialValues={{ mycomment: "" }}
          validationSchema={addCommentSchema}
          onSubmit={async (values, actions) => {
            if (commentImage) {
              try {
                // Upload image to Cloudinary
                let base64Img = `data:image/jpg;base64,${commentImage.base64}`;
                let apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

                let data = {
                  file: base64Img,
                  upload_preset: "ehsnm9es",
                  api_key: apiKey,
                };

                const uploadResponse = await fetch(apiUrl, {
                  body: JSON.stringify(data),
                  headers: {
                    "content-type": "application/json",
                  },
                  method: "POST",
                });

                const uploadData = await uploadResponse.json();
                const imageUrl = uploadData["secure_url"];

                const token =
                  Platform.OS !== "web"
                    ? await SecureStore.getItemAsync("token")
                    : null;

                const payload = {
                  ...user,
                  currentPost: route.params.currentPost,
                  mycomment: values.mycomment,
                  imageUrl: imageUrl,
                  token,
                };

                socket.emit("insert comment return updated list", payload);
                actions.resetForm();
                setCommentImage(null);
                setCommentImageError("");
                await getComments();
              } catch (error) {
                console.error("Image upload error:", error);
                setCommentImageError("Failed to upload image. Please try again.");
              }
            } else {
              const token =
                Platform.OS !== "web"
                  ? await SecureStore.getItemAsync("token")
                  : null;

              const payload = {
                ...user,
                currentPost: route.params.currentPost,
                mycomment: values.mycomment,
                token,
              };

              socket.emit("insert comment return updated list", payload);
              actions.resetForm();
              await getComments();
            }
          }}
          // onSubmit={async (values, actions) => {
          //   const token =
          //     Platform.OS !== "web"
          //       ? await SecureStore.getItemAsync("token")
          //       : null;
          //   const uservals = { ...user, ...values, token };
          //   actions.resetForm();
          //   socket.emit("insert comment return updated list", uservals);
          // }}
        >
          {(props) => (
            <View
              style={{
                width: "100%",
                marginBottom: deviceWidth > 500 ? 0 : "-4%",
              }}
            >
              <Text style={[globalStyles.captionError, { padding: 4 }]}>
                <ErrorMessage name="mycomment" />
              </Text>
              {commentImageError ? (
                <Text style={[globalStyles.captionError, { padding: 4 }]}>
                  {commentImageError}
                </Text>
              ) : null}
              {commentImage && (
                <View
                  style={{
                    marginBottom: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 8,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 8,
                  }}
                >
                  <Image
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                    }}
                    source={{ uri: commentImage.uri }}
                  />
                  <TouchableOpacity
                    onPress={removeCommentImage}
                    style={{
                      padding: 8,
                      backgroundColor: "#ff4444",
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderColor: "#ddd",
                  borderRadius: 16,
                  borderWidth: 1,
                  backgroundColor: "#fbfbfb",
                  elevation: 15,
                  shadowColor: "#333333",
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  shadowOffset: {
                    width: 0.8,
                    height: 0.8,
                  },
                  overflow: "visible",
                }}
              >
                <TextInput
                  style={{
                    padding: 10,
                    fontSize: 18,
                    fontFamily: "Poppins_400Regular",
                    letterSpacing: 0.5,
                    alignContent: "center",
                    color: "#767676",
                    width:
                      deviceWidth > 500
                        ? deviceWidth * 0.75 - 112
                        : deviceWidth * 0.9 - 112,
                  }}
                  multiline={true} // Allows new lines
                  numberOfLines={2} // Keeps it visually small
                  textAlignVertical="top" // Keeps text aligned properly
                  placeholder="Add comment..."
                  onChangeText={props.handleChange("mycomment")}
                  value={props.values.mycomment}
                />
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={pickCommentImage}
                >
                  <MaterialIcon
                    name={commentImage ? "photo" : "add-a-photo"}
                    size={24}
                    color="#2482AA"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 16,
                    elevation: 3,
                    backgroundColor: "#2482AA",
                    alignSelf: "center",
                    elevation: 15,
                    shadowColor: "#333333",
                    shadowOpacity: 0.5,
                    shadowRadius: 2,
                    shadowOffset: {
                      width: 0.8,
                      height: 0.8,
                    },
                    overflow: "visible",
                  }}
                  onPress={props.handleSubmit}
                >
                  <FAIcon name="arrow-up" size={30} color="#fbfbfb" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}
