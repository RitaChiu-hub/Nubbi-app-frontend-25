import * as React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { globalStyles } from "../../styles/global";
const { addMessageSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import socket from "../../socket";

export default function PostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [posts, setPosts] = React.useState([]);
  const isFocused = useIsFocused();
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const deviceWidth = Dimensions.get("window").width;

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
        `https://coral-app-n96bn.ondigitalocean.app/auth/checkweblogin`,
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

  //const getPosts = async () => {
  const getPosts = async (groupId, signal) => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/${groupId}/posts`,
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

  React.useEffect(() => {
    // Snapshot the group id for this run
    const groupId = user.currentGroup;
    // Clear stale items immediately to avoid flashing old content
    setPosts([]);
    setLoading(true);
    const controller = new AbortController();
    getPosts(groupId, controller.signal).finally(() => {
      if (!controller.signal.aborted && user.currentGroup === groupId) {
        setLoading(false);
      }
    });
    // Cancel in‑flight request if group changes or screen blurs/unmounts
    return () => controller.abort();
  }, [user.currentGroup, isFocused]);

  const Item = ({
    title,
    id,
    body,
    post_author,
    isoTimeSent,
    point_total,
    number_comments,
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
        onPress={() => {
          setUser({
            ...user,
            currentPost: id,
            post_title: title,
            post_body: body,
            post_author: post_author,
            isoTimeSent: isoTimeSent,
            number_comments: number_comments,
          }),
            navigation.navigate("ViewPost", { currentPost: id });
        }}
      >
        <View style={{ paddingHorizontal: 1 }}>
          <Text
            style={{
              color: "#050505",
              fontSize: 18,
              fontFamily: "Poppins_600SemiBold",
              flexShrink: 1,
              flexWrap: "wrap",
              maxWidth:
                deviceWidth > 500 ? deviceWidth * 0.7 : deviceWidth * 0.8,
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          {/* <Text
            style={{
              color: "#050505",
              fontSize: 18,
              fontFamily: "Poppins_600SemiBold",
            }}
          >
            {title}
          </Text> */}
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
      {!loading && (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.post_id)}
        />
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
