import * as React from "react";
import { API_URL } from "../../config";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { globalStyles, nuubiColors } from "../../styles/global";
const { addMessageSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "../../socket";
import { subscribePostThreadViewed } from "../../services/postThreadViewedBridge";

export default function PostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [posts, setPosts] = React.useState([]);
  // Post ids the user just left (ViewPost blur): keep NEW off until API agrees.
  const instantClearNewIdsRef = React.useRef(new Set());
  const currentGroupRef = React.useRef(user.currentGroup);
  currentGroupRef.current = user.currentGroup;
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const GROUP_KEY = "currentGroup";
  const LAST_VIEWED_KEY = "lastViewedPosts";

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

  // Per-group map written by ViewPost on blur; sent to API so it can compute has_new_activity.
  async function loadLastViewedPosts(groupId) {
    const key = `${LAST_VIEWED_KEY}_${groupId}`;
    try {
      const v =
        Platform.OS === "web"
          ? localStorage.getItem(key)
          : await AsyncStorage.getItem(key);
      return v ? JSON.parse(v) : {};
    } catch {
      return {};
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

  // Reset the instant-clear cache when switching groups
  React.useEffect(() => {
    instantClearNewIdsRef.current.clear();
  }, [user?.currentGroup]);

  // ViewPost emits on blur before storage/network finish — update list immediately.
  React.useEffect(() => {
    return subscribePostThreadViewed(({ postId, groupId }) => {
      if (String(groupId) !== String(currentGroupRef.current)) return;
      instantClearNewIdsRef.current.add(String(postId));
      setPosts((prev) =>
        prev.map((p) =>
          String(p.post_id) === String(postId)
            ? { ...p, has_new_activity: false }
            : p
        )
      );
    });
  }, []);

  // After fetch, strip NEW for any post we already marked viewed in-session (avoids flicker).
  function applyInstantNewClear(rows) {
    if (!Array.isArray(rows)) return rows;
    const next = rows.map((p) => {
      const id = String(p.post_id);
      if (instantClearNewIdsRef.current.has(id)) {
        return { ...p, has_new_activity: false };
      }
      return p;
    });
    next.forEach((p) => {
      if (!p.has_new_activity) {
        instantClearNewIdsRef.current.delete(String(p.post_id));
      }
    });
    return next;
  }

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

  // viewedPosts = fresh read from AsyncStorage/localStorage (see loadLastViewedPosts).
  const getPosts = async (groupId, signal, viewedPosts = {}) => {
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
          body: JSON.stringify({ 
            ...user, 
            currentGroup: groupId,
            lastViewedPosts: viewedPosts,
          }),
          signal,
        }
      );
      const jsonData = await response.json();

      if (!signal.aborted && user.currentGroup === groupId) {
        const rows = Array.isArray(jsonData) ? jsonData : [];
        setPosts(applyInstantNewClear(rows));
      }
    } catch (err) {
      // console.error(err.message);
      if (err.name !== "AbortError") {
        console.error(err.message);
      }
    }
  };

  // Refetch when this tab gains focus so NEW reflects others’ posts/comments + storage.
  useFocusEffect(
    React.useCallback(() => {
      if (!isLoggedIn) return;

      const groupId = user.currentGroup;
      const controller = new AbortController();

      setLoading(true);

      (async () => {
        try {
          // Reload lastViewedPosts in case ViewPost updated it after blur.
          const viewed = groupId ? await loadLastViewedPosts(groupId) : {};
          await getPosts(groupId, controller.signal, viewed);
        } finally {
          if (!controller.signal.aborted && user.currentGroup === groupId) {
            setLoading(false);
          }
        }
      })();

      return () => controller.abort();
    }, [user.currentGroup, isLoggedIn])
  );

  const Item = ({
    title,
    id,
    body,
    post_author,
    isoTimeSent,
    point_total,
    number_comments,
    has_new_activity,
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
          position: "relative",
        }}
        // Log to server when a post is clicked
        onPress={async () => {
          // Clear NEW immediately so coming back doesn't flash stale has_new_activity
          // from the previous fetch (ViewPost still persists lastViewed after comments load).
          setPosts((prev) =>
            prev.map((p) =>
              p.post_id === id || String(p.post_id) === String(id)
                ? { ...p, has_new_activity: false }
                : p
            )
          );

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
          }),
            navigation.navigate({
              name: "ViewPost",
              key: `post-${id}`,
              params: { currentPost: id },
              merge: false,
            });
        }}
      >
        <View style={{ paddingHorizontal: 1, flex: 1, position: "relative", width: "100%" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text
              style={{
                color: "#050505",
                fontSize: 18,
                fontFamily: "Poppins_600SemiBold",
                flexShrink: 1,
                flexWrap: "wrap",
                flex: 1,
              }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>
          {has_new_activity && (
            <View
              style={{
                position: "absolute",
                right: -6,
                top: -6,
                // Same teal as primary buttons (accessibility-approved contrast with white).
                backgroundColor: nuubiColors.darkerBlue,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 11,
                  fontFamily: "Poppins_600SemiBold",
                  letterSpacing: 0.3,
                }}
              >
                NEW
              </Text>
            </View>
          )}
          <Text
            style={globalStyles.bodyRegular}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {post_author}: {body}
          </Text>
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
      has_new_activity={item.has_new_activity}
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
          !loading ? <Text style={{ margin: 16 }}>No posts yet.</Text> : null
        }
      />

      {loading && <Text style={{ margin: 16 }}>Refreshing…</Text>}
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
