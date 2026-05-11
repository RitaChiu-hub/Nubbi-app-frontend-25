import * as React from "react";
import { API_URL } from "../../config";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import FAIcon from "@expo/vector-icons/FontAwesome";
import { globalStyles } from "../../styles/global";
const { addMessageSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import moment from "moment";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import socket from "../../socket";

export default function PostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [posts, setPosts] = React.useState([]);
  const isFocused = useIsFocused();
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const deviceWidth = Dimensions.get("window").width;

  const GROUP_KEY = "currentGroup";

  async function saveGroup(id) {
    const v = String(id);
    if (Platform.OS === "web") {
      try {
        localStorage.setItem(GROUP_KEY, v);
      } catch {}
    } else {
      try {
        await AsyncStorage.setItem(GROUP_KEY, v);
      } catch {}
    }
  }

  async function loadGroup() {
    try {
      const v =
        Platform.OS === "web"
          ? localStorage.getItem(GROUP_KEY)
          : await AsyncStorage.getItem(GROUP_KEY);
      return v ? Number(v) : null;
    } catch {
      return null;
    }
  }

  // Save when group changes
  React.useEffect(() => {
    if (user?.currentGroup) saveGroup(user.currentGroup);
  }, [user?.currentGroup]);

  // Restore once on mount if missing
  React.useEffect(() => {
    (async () => {
      if (!user?.currentGroup) {
        const saved = await loadGroup();
        if (saved) setUser((u) => ({ ...u, currentGroup: saved }));
      }
    })();
  }, []);

  // For Mobile: Retrieve token from SecureStore
  async function getTokenFromSecureStore() {
    try {
      const token = await SecureStore.getItemAsync("token");
      return token || null;
    } catch (error) {
      return null;
    }
  }

  // For Web
  async function checkWebLogin() {
    try {
      const response = await fetch(
        `${API_URL}/auth/checkweblogin`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return data.isLoggedIn; // Assuming the backend returns { isLoggedIn: true/false }
    } catch (error) {
      console.error("Error checking login status:", error);
      return false; // Default to false if there's an error
    }
  }

  // Check if user is logged in (cross-platform)
  async function checkIsLoggedIn() {
    if (Platform.OS === "web") {
      // Web: Use the new checkWebLogin function
      return await checkWebLogin();
    } else {
      // Mobile: Check SecureStore
      const token = await getTokenFromSecureStore();
      return !!token; // Check if token exists
    }
  }

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await checkIsLoggedIn(); // Call the async login check
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus(); // Run the check when the component mounts
  }, [user.loggedIn]);

  React.useEffect(() => {
    if (isLoggedIn === true && !socket.connected) {
      socket.connect();
    } else {
      console.log("disconnect socket??");
    }
  }, [isLoggedIn]);

  const getPosts = async (groupId, signal) => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_URL}/groups/${groupId}/posts`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          // body: JSON.stringify({ ...user }),
          body: JSON.stringify({ ...user, currentGroup: groupId }),
          signal,
        }
      );
      const jsonData = await response.json();

      //  setPosts(jsonData);
      if (!signal.aborted && user.currentGroup === groupId) {
        setPosts(Array.isArray(jsonData) ? jsonData : []);
      }
    } catch (err) {
      // console.error(err.message);
      if (err.name !== "AbortError") {
        console.error(err.message);
      }
    }
  };

  // React.useEffect(() => {
  //   getPosts();
  // }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      if (!isLoggedIn) return;

      const groupId = user.currentGroup;
      const controller = new AbortController();

      setLoading(true); // don't setPosts([]) here

      (async () => {
        try {
          await getPosts(groupId, controller.signal); // setPosts happens inside getPosts
        } finally {
          // only end loading if we didn't abort and the group hasn't changed
          if (!controller.signal.aborted && user.currentGroup === groupId) {
            setLoading(false);
          }
        }
      })();

      // cancel in-flight fetch if we blur/unmount
      return () => controller.abort();
    }, [user.currentGroup, isLoggedIn])
  );

  // React.useEffect(() => {
  //   // Snapshot the group id for this run
  //   const groupId = user.currentGroup;
  //   // Clear stale items immediately to avoid flashing old content
  //   setPosts([]);
  //   setLoading(true);
  //   const controller = new AbortController();
  //   getPosts(groupId, controller.signal).finally(() => {
  //     if (!controller.signal.aborted && user.currentGroup === groupId) {
  //       setLoading(false);
  //     }
  //   });
  //   // Cancel in‑flight request if group changes or screen blurs/unmounts
  //   return () => controller.abort();
  // }, [user.currentGroup, isFocused]);

  const Item = ({
    title,
    id,
    body,
    post_author,
    isoTimeSent,
    point_total,
    number_comments,
    image_url,
    file_url,
    file_name,
  }) => (
    <View>
      <TouchableOpacity
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 16,
          minWidth: 300,
          borderWidth: 1,
          borderRadius: 16,
          marginHorizontal: 16,
          marginVertical: 8,
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
        }}
        // Log to server when a post is clicked
        onPress={async () => {
          try {
            const token = Platform.OS !== "web"
              ? await SecureStore.getItemAsync("token")
              : sessionStorage.getItem("token");

            const res = await fetch(`${API_URL}/logs/view`, 
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                  contentType: "post",
                  contentId: id,
                  groupId: user.currentGroup,
                  deviceType: Platform.OS,
                }),
              });

              if (!res.ok) {
                console.log("Failed to log view:", res.status);
              }
            } catch (err) {
              console.log("Error logging view:", err);
              }
          setUser({
            ...user,
            currentPost: id,
            post_title: title,
            post_body: body,
            post_author: post_author,
            isoTimeSent: isoTimeSent,
            number_comments: number_comments,
            image_url: image_url,
            file_url: file_url,
            file_name: file_name,
          }),
            //   navigation.push("ViewPost", { currentPost: id });
            //  navigation.navigate("ViewPost", { currentPost: id });
            // or, if you prefer navigate:
            navigation.navigate({
              name: "ViewPost",
              key: `post-${id}`, // unique key per post
              params: { currentPost: id },
              merge: false, // don't merge old params
            });
        }}
      >
        <View style={{ paddingHorizontal: 1, flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
          <View style={{ flex: 1, paddingRight: image_url ? 10 : 0 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  color: "#050505",
                  fontSize: 18,
                  fontFamily: "Poppins_600SemiBold",
                  flexShrink: 1,
                  flexWrap: "wrap",
                  maxWidth:
                    deviceWidth > 500 ? deviceWidth * 0.6 : deviceWidth * 0.7,
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
              {file_url && (
                <View style={{ marginLeft: 8 }}>
                  <FAIcon name="file" size={16} color="#2482AA" />
                </View>
              )}
            </View>
            <Text
              style={globalStyles.bodyRegular}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {post_author}: {body}
            </Text>
          </View>
          {image_url && (
            <Image
              source={{ uri: image_url }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                backgroundColor: "#eee",
              }}
              resizeMode="cover"
            />
          )}
        </View>
        <View style={{ paddingVertical: 2 }}></View>
        <Text style={globalStyles.bodyRegular}>
          {point_total} points • {number_comments}{" "}
          {number_comments === "1" ? "comment" : "comments"} •{" "}
          {moment(isoTimeSent).calendar()}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      title={item.title}
      id={item.post_id}
      body={item.body_text}
      post_author={item.post_author}
      isoTimeSent={item.created_at}
      point_total={item.point_total}
      number_comments={item.number_comments}
      image_url={item.image_url}
      file_url={item.file_url}
      file_name={item.file_name}
    />
  );

  return (
    <View
      key={user.currentGroup}
      style={{
        flex: 1,
        paddingTop: 8,
        backgroundColor: "#fbfbfb",
      }}
    >
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.post_id)}
        ListEmptyComponent={
          !loading ? (
            <Text style={{ margin: 16 }}>No posts yet.</Text>
          ) : (
            <Text style={{ margin: 16 }}>Loading your group threads...</Text>
          )
        }
      />

      {loading && posts.length > 0 && (
        <Text style={{ margin: 16, textAlign: "center" }}>Refreshing…</Text>
      )}
      
      <View style={{ marginHorizontal: 16, marginVertical: 16 }}>
        <TouchableOpacity
          style={globalStyles.primaryButtonWide}
          accessibilityRole="button"
          onPress={() => {
            navigation.navigate("CreatePost");
          }}
        >
          <Text style={globalStyles.primaryButtonText}>Create Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
