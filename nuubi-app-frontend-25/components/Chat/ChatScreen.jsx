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
  Dimensions,
  Image,
  AppState,
} from "react-native";
import { useAssets } from "expo-asset";
import { Formik } from "formik";
const { addMessageSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import socket from "../../socket";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import FAIcon from "@expo/vector-icons/FontAwesome";
import * as SecureStore from "expo-secure-store";
import Markdown from "react-native-markdown-display";

export default function ChatScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [chats, setChats] = React.useState([]);
  const [adminId, setAdminId] = React.useState(null);
  const isFocused = useIsFocused();
  const [likes, setLikes] = React.useState([]);
  const [isChanged, setIsChanged] = React.useState(false);
  const headerHeight = useHeaderHeight();
  const INPUT_BAR_HEIGHT = 60;
  const screenWidth = Dimensions.get("window").width;
  const viewedMessagesRef = React.useRef(new Set());
  const scrollViewRef = React.useRef();
  let assets1 = useAssets([require("../../assets/defaultAvatar.png")]);

  const logMessageView = async (messageId, groupId) => {

    // don't log if not on this screen
    if (!isFocused) {
      return;
    }
    
    // check if already viewed in this session
    if (viewedMessagesRef.current.has(messageId)) {
      return;
    }
    
    // mark as viewed
    viewedMessagesRef.current.add(messageId);
    
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    
    try {
      const res = await fetch(`${API_URL}/logs/view`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          contentType: "message",
          contentId: messageId,
          groupId: groupId,
          deviceType: Platform.OS,
        }),
      });

      if (!res.ok) {
        console.log("Failed to log message view:", res.status);
      }
    } catch (err) {
      console.log("Error logging message view:", err);
    }
  };

  const getGroupInfo = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_URL}/groups/getgroupinfo`,
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

      const text = await response.text();
      if (!text) {
        console.warn("getGroupInfo: empty response body");
        return;
      }
      let jsonData;
      try {
        jsonData = JSON.parse(text);
      } catch (e) {
        console.warn("getGroupInfo: invalid JSON", e, text);
        return;
      }

      setAdminId(jsonData.admin_id);
      const visibilitySetting =
        jsonData.is_public === false ? "Private" : "Public";
      setUser({
        ...user,
        groupName: jsonData.groupname,
        groupDescription: jsonData.description,
        visibility: visibilitySetting,
      });
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
        `${API_URL}/groupchat/getlikes`,
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
          ? [...new Set(jsonData.map((item) => item.messages_id))]
          : [];
      setLikes(myLikes);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getChats = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_URL}/groupchat/getmessages`,
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
      setChats(jsonData);
      // log views for fetched messages
      if (isFocused && Array.isArray(jsonData)) {
          jsonData.forEach(chat => {
            logMessageView(chat.messages_id, user.currentGroup);
          });
        }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getIsAdmin = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_URL}/groups/isadmin`,
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
      setUser(jsonData);
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

  React.useEffect(() => {
    const handler = (newMsg) => {
      setChats((prev) =>
        prev.some((m) => m.messages_id === newMsg.messages_id)
          ? prev
          : [...prev, newMsg]
      );
      // log view for the new message
      if (isFocused) {
        logMessageView(newMsg.messages_id, user.currentGroup);
      }
    };
    socket.on("insert msg return updated list", handler);
    return () => socket.off("insert msg return updated list", handler);
  }, []);

  React.useEffect(() => {
    viewedMessagesRef.current.clear();
    setChats([]);
    getLikes();
    getChats();
    getIsAdmin();
    getGroupInfo();
  }, [isFocused, user.currentGroup]);

  React.useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        getChats();
        getLikes();
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={
        Platform.OS === "ios" ? headerHeight + INPUT_BAR_HEIGHT : 0
      }
      style={{ flex: 1, backgroundColor: "#fbfbfb" }}
    >
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: INPUT_BAR_HEIGHT,
        }}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {chats &&
          chats.map((chat) => (
            <View
              key={chat.messages_id}
              style={{
                paddingLeft: 0,
                backgroundColor: "transparent",
                padding: 8,
                marginTop: 4,
                width:
                  Platform.OS === "web" && screenWidth > 600
                    ? "100%"
                    : screenWidth * 0.85,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                {/* Avatar + Points */}
                <View
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginLeft:
                      Platform.OS === "web" && screenWidth > 600 ? 12 : 0,
                    marginRight:
                      Platform.OS === "web" && screenWidth > 600 ? 16 : 0,
                    flex: 0,
                    maxWidth:
                      Platform.OS === "web" && screenWidth > 600 ? 70 : 60,
                  }}
                >
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 20,
                      marginVertical: 3,
                      marginTop: 4,
                    }}
                    source={
                      chat?.sender_avatar_url
                        ? { uri: chat.sender_avatar_url }
                        : Platform.OS === "web"
                        ? require("../../assets/defaultAvatar.png")
                        : assets1[0]
                    }
                  />
                  <View style={{ flexDirection: "row", marginTop: 1 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#2482AA",
                        fontSize: 16,
                        margin: 2,
                        marginRight: 1,
                      }}
                    >
                      {chat.message_points}
                    </Text>
                    <TouchableOpacity
                      onPress={async () => {
                        const newLikes = [...likes];
                        if (!newLikes.includes(chat.messages_id)) {
                          newLikes.push(chat.messages_id);
                          chat.message_points++;
                        } else {
                          const index = newLikes.indexOf(chat.messages_id);
                          newLikes.splice(index, 1);
                          chat.message_points--;
                        }
                        setLikes(newLikes);
                        setIsChanged(!isChanged);

                        const token =
                          Platform.OS !== "web"
                            ? await SecureStore.getItemAsync("token")
                            : sessionStorage.getItem("token");

                        await fetch(
                          `${API_URL}/groups/addmessagepoint`,
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
                              message_id: chat.messages_id,
                            }),
                          }
                        );
                      }}
                    >
                      <Text
                        style={{
                          color: likes.includes(chat.messages_id)
                            ? "#228ee7"
                            : "#bbb",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Message Bubble */}
                <View style={{ flex: 1, marginLeft: 8 }}>
                  {/* Username + Time */}
                  <View
                    style={{
                      flexDirection: "row",
                      paddingLeft: 4,
                      backgroundColor: "transparent",
                      padding: 4,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "left",
                        fontSize: 14,
                        fontFamily: "Poppins_500Medium",
                        color: chat.user_id === adminId ? "#050505" : "#333",
                      }}
                    >
                      {chat.sender_username},{" "}
                      {moment(chat.iso_time_sent).calendar()}
                    </Text>
                  </View>

                  {/* Message Container */}
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "#ddd",
                      borderRadius: 16,
                      padding: 8,
                      backgroundColor: "#fff",
                      width: screenWidth * 0.7,
                      alignSelf: "flex-start",
                      flexShrink: 1,
                      shadowColor: "#333333",
                      shadowOpacity: 0.5,
                      shadowRadius: 2,
                      shadowOffset: {
                        width: 0.8,
                        height: 0.8,
                      },
                    }}
                  >
                    <Markdown
                      style={{
                        body: {
                          fontFamily: "Poppins_400Regular",
                          fontSize: 14,
                          color: "#050505",
                          flexShrink: 1,
                        },
                        strong: { fontFamily: "Poppins_600SemiBold" },
                        em: { fontStyle: "italic" },
                        link: { color: "#2482AA" },
                        bullet_list: { paddingLeft: 8 },
                        ordered_list: { paddingLeft: 8 },
                        list_item: { marginVertical: 2 },
                        block_quote: {
                          borderLeftWidth: 3,
                          borderLeftColor: "#7DDFA0",
                          paddingLeft: 8,
                          fontStyle: "italic",
                          color: "#555",
                        },
                        code_inline: {
                          backgroundColor: "#f1f1f1",
                          borderRadius: 4,
                          fontFamily: mono,
                          fontSize: 13,
                          paddingHorizontal: 4,
                          paddingVertical: 2,
                          flexShrink: 1,
                        },
                        fence: {
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
                      onError={(error) => {
                        console.warn("Markdown rendering error:", error);
                        return <Text>{chat.text}</Text>;
                      }}
                    >
                      {chat.text}
                    </Markdown>
                  </View>
                </View>
              </View>
            </View>
          ))}
      </ScrollView>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 10,
          backgroundColor: "#fbfbfb",
          borderTopWidth: 1,
          borderColor: "#ddd",
        }}
      >
        <Formik
          initialValues={{ mymessage: "" }}
          validationSchema={addMessageSchema}
          onSubmit={async (values, actions) => {
            const token =
              Platform.OS !== "web"
                ? await SecureStore.getItemAsync("token")
                : sessionStorage.getItem("token");
            const payload = {
              ...user,
              mymessage: values.mymessage,
              token,
            };
            socket.emit("insert msg return updated list", payload);
            actions.resetForm();
            await getChats();
          }}
        >
          {(props) => (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  backgroundColor: "#fbfbfb",
                  alignItems: "center",
                  paddingHorizontal: 10,
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    fontFamily: "Poppins_400Regular",
                    fontSize: 16,
                    color: "#767676",
                    paddingVertical: 10,
                  }}
                  placeholder="Write a message..."
                  onChangeText={props.handleChange("mymessage")}
                  value={props.values.mymessage}
                  multiline={true}
                />
                <TouchableOpacity
                  onPress={props.handleSubmit}
                  disabled={!props.values.mymessage.trim()}
                  style={{
                    padding: 10,
                    borderRadius: 12,
                    backgroundColor: !props.values.mymessage.trim()
                      ? "#cccccc"
                      : "#2482AA",
                    marginLeft: 10,
                  }}
                >
                  <FAIcon name="paper-plane" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}
