import * as React from "react";
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
} from "react-native";
import { useAssets } from "expo-asset";
import { Formik, ErrorMessage } from "formik";
const { addMessageSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import socket from "../../socket";
import moment from "moment";
import { globalStyles } from "../../styles/global";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import FAIcon from "@expo/vector-icons/FontAwesome";
import { useLocalStorage } from "@uidotdev/usehooks";
import * as SecureStore from "expo-secure-store";

export default function ChatScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [chats, setChats] = React.useState([]);
  const [adminId, setAdminId] = React.useState(null);
  const isFocused = useIsFocused();
  const [likes, setLikes] = React.useState([]);
  const [isChanged, setIsChanged] = React.useState(false);
  const height = useHeaderHeight();
  const INPUT_BAR_HEIGHT = 60; // <—  roughly your bar’s height
  const headerHeight = useHeaderHeight();
  // const [selectedTab, setSelectedTab] = React.useState("Chat");
  const screenWidth = Dimensions.get("window").width;

  const scrollViewRef = React.useRef();
  let assets1 = useAssets([require("../../assets/defaultAvatar.png")]);

  const getGroupName = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getgroupinfo`,
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
    } catch (err) {
      console.error(err.message);
    }
  };

  const getGroupInfo = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getgroupinfo`,
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

      // read raw text and bail out if empty
      const text = await response.text();
      if (!text) {
        console.warn("getGroupInfo: empty response body");
        return;
      }
      // safe JSON parsing
      let jsonData;
      try {
        jsonData = JSON.parse(text);
      } catch (e) {
        console.warn("getGroupInfo: invalid JSON", e, text);
        return;
      }

      // const jsonData = await response.json();
      setAdminId(jsonData.admin_id);
      const visibilitySetting =
        jsonData.is_public === false ? "Private" : "Public";
      const groupInfo = {
        ...jsonData,
        visibility: visibilitySetting,
        is_public: jsonData.is_public,
      };
      setUser({
        ...user,
        groupName: groupInfo.groupname,
        groupDescription: groupInfo.description,
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
        `https://coral-app-n96bn.ondigitalocean.app/groupchat/getlikes`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          //    body: Platform.OS === "web" ? context : JSON.stringify({ ...user }),
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
        "https://coral-app-n96bn.ondigitalocean.app/groupchat/getmessages",
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
        `https://coral-app-n96bn.ondigitalocean.app/groups/isadmin`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          //  body: Platform.OS === "web" ? context : JSON.stringify({ ...user }),
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setUser(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  // 1) Register socket listener on mount only
  React.useEffect(() => {
    socket.on("insert msg return updated list", (newMsg) => {
      setChats((prev) => [...prev, newMsg]);
    });
    return () => {
      socket.off("insert msg return updated list");
    };
  }, []);

  // 2) Fetch all the metadata + history whenever you focus or switch groups
  React.useEffect(() => {
    getLikes();
    getGroupName();
    getChats();
    getIsAdmin();
    getGroupInfo();
  }, [isFocused, user.currentGroup]);

  const KeyboardBehavior = Platform.OS === "android" ? "false" : "padding";

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
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingBottom: INPUT_BAR_HEIGHT,
        }}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {chats &&
          chats.map((chats) => (
            <View key={chats.messages_id}>
              <View
                style={{
                  paddingLeft: 0,
                  backgroundColor: "transparent",
                  padding: 8,
                  marginTop: 4,
                  width: screenWidth * 0.8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                    //  paddingTop: 1,
                    }}
                  >
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        borderRadius: 20,
                        margin: 3,
                        marginRight: 6,
                      }}
                      source={
                        chats?.sender_avatar_url
                          ? { uri: chats.sender_avatar_url }
                          : Platform.OS === "web"
                          ? require("../../assets/defaultAvatar.png")
                          : assets1[0]
                      }
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 1
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "#2482AA",
                          fontSize: 16,
                          margin: 2,
                          marginRight: 1,
                        }}
                      >
                        {chats.message_points}
                      </Text>
                      <TouchableOpacity
                        onPress={async () => {
                          if (!likes.includes(chats.messages_id)) {
                            likes.push(chats.messages_id);
                            setLikes(likes);
                            chats.message_points++;
                            setIsChanged(!isChanged);
                          } else {
                            const index = likes.indexOf(chats.messages_id);
                            likes.splice(index, 1);
                            setLikes(likes);
                            chats.message_points--;
                            setIsChanged(!isChanged);
                          }

                          const token =
                            Platform.OS !== "web"
                              ? await SecureStore.getItemAsync("token")
                              : sessionStorage.getItem("token"); // Get token only on mobile

                          fetch(
                            `https://coral-app-n96bn.ondigitalocean.app/groups/addmessagepoint`,
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
                                message_id: chats.messages_id,
                              }),
                            }
                          );
                        }}
                      >
                        <Text
                          style={{
                            color: likes.includes(chats.messages_id)
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
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingLeft: 4,
                        backgroundColor: "transparent",
                        padding: 4,
                        elevation: 15,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 14,
                          fontFamily: "Poppins_500Regular",
                          color: chats.user_id === adminId ? "#050505" : "#333",
                        }}
                      >
                        {chats.sender_username},{" "}
                        {moment(chats.iso_time_sent).calendar()}
                      </Text>
                    </View>
                    <Text
                      style={{
                        // paddingLeft: 4,
                        padding: 12,
                        color: "#050505",
                        fontFamily: "Poppins_400Regular",
                        fontSize: 14,
                        letterSpacing: 0.5,
                        elevation: 15,
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 16,
                        width: screenWidth * 0.7,
                      }}
                    >
                      {chats.text}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
      </ScrollView>
      <View
        style={{
          paddingVertical: 10,
          //    paddingBottom: Platform.OS === "ios" ? 20 : 10,
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
                  placeholder="Write a message... "
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
