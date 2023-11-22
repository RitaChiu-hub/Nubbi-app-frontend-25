import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
const { addMessageSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import socket from "../../socket";
import moment from "moment";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FAIcon from "react-native-vector-icons/FontAwesome";

export default function ChatScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [chats, setChats] = React.useState([]);
  const [groupTitle, setGroupTitle] = React.useState(user.groupName);
  const [adminId, setAdminId] = React.useState(null);
  const isFocused = useIsFocused();
  const [likes, setLikes] = React.useState([]);
  const [isChanged, setIsChanged] = React.useState(false);
  const height = useHeaderHeight();

  const scrollViewRef = React.useRef();

  const getGroupName = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getgroupinfo`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setGroupTitle(jsonData.groupname);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getGroupInfo = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getgroupinfo`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setAdminId(jsonData.admin_id);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getLikes = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groupchat/getlikes`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
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

  React.useEffect(() => {
    getGroupName();
  }, [isFocused]);

  const getChats = async () => {
    try {
      const response = await fetch(
        "https://coral-app-n96bn.ondigitalocean.app/groupchat/getmessages",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
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
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/isadmin`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
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

  React.useEffect(() => {
    getLikes();
    getChats();
    getIsAdmin();
    getGroupInfo();
  }, []);

  React.useEffect(() => {
    socket.on("insert msg return updated list", (jsonData) => {
      setChats(jsonData);
      getChats();
    });
  }, [chats]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View>
          <TouchableOpacity
            style={{
              alignItems: "center",
              // justifyContent: "center",
            }}
            onPress={() => navigation.navigate("GroupInfo")}
          >
            <Text
              // numberOfLines={2}
              style={globalStyles.h3HeadingPrimary}
            >
              {groupTitle}
            </Text>
          </TouchableOpacity>
        </View>
      ),
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("PostScreen")}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Icon name="forum-outline" size={30} color="#4F8EF7" />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, groupTitle]);

  const KeyboardBehavior = Platform.OS === "android" ? "false" : "padding";

  return (
    <KeyboardAvoidingView
      behavior={KeyboardBehavior}
      keyboardVerticalOffset={height}
      style={{
        flex: 1,
        backgroundColor: "#fdfdfd",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
        style={{ width: "90%" }}
      >
        {chats &&
          chats.map((chats) => {
            return (
              <View
                key={chats.messages_id}
                style={{
                  backgroundColor: "transparent",
                  padding: 5,
                  marginTop: 10,
                  marginRight: 40,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#0000cd",
                      fontSize: 16,
                    }}
                  >
                    {chats.message_points}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
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

                      fetch(
                        `https://coral-app-n96bn.ondigitalocean.app/groups/addmessagepoint`,
                        {
                          method: "POST",
                          credentials: "include",
                          headers: {
                            "Content-Type": "application/json",
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
                        fontSize: 16,
                        fontWeight: "bold",
                        paddingBottom: 2,
                        paddingRight: 2,
                      }}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: chats.user_id === adminId ? "purple" : "#333",
                    }}
                  >
                    {chats.sender_username}
                  </Text>
                  <View style={{ marginHorizontal: 2 }}></View>
                  <Text style={{ fontSize: 10, color: "grey" }}>
                    {moment(chats.iso_time_sent).calendar()}
                  </Text>
                </View>
                <Text style={{ color: "#333" }}>{chats.text}</Text>
              </View>
            );
          })}
      </ScrollView>

      <View
        style={{
          width: "100%",
          paddingBottom: 20,
          backgroundColor: "#fdfdfd",
        }}
      >
        <Formik
          initialValues={{ mymessage: "" }}
          validationSchema={addMessageSchema}
          onSubmit={(values, actions) => {
            const vals = { ...values };
            const uservals = { ...user, ...values };
            actions.resetForm();
            socket.emit("insert msg return updated list", uservals);
          }}
        >
          {(props) => (
            <View>
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                }}
              >
                <ErrorMessage name="mymessage" />
              </Text>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 12,
                  marginHorizontal: 20,
                  paddingHorizontal: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    style={{
                      padding: 12,
                      fontSize: 18,
                      width: "90%",
                      paddingTop: 12,
                    }}
                    placeholder="Send message..."
                    onChangeText={props.handleChange("mymessage")}
                    value={props.values.mymessage}
                    multiline={true}
                  />
                  <View style={{ padding: 5 }}></View>
                  <TouchableOpacity onPress={props.handleSubmit}>
                    <FAIcon name="send" size={30} color="#4F8EF7" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}
