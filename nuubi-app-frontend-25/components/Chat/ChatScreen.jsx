import * as React from "react";
import {
  Button,
  TextInput,
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { addMessageSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
import socket from "../../socket";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";

export default function ChatScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [chats, setChats] = React.useState([]);
  const [groupTitle, setGroupTitle] = React.useState(user.groupName);
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
  }, []);

  React.useEffect(() => {
    socket.on("insert msg return updated list", (jsonData) => {
      setChats(jsonData);
      getChats();
    });
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.navigate("GroupInfo")}
          >
            <Text
              //	numberOfLines={2}
              style={{
                fontWeight: "bold",
                color: "#228ee7",
                fontSize: 16,
              }}
            >
              {groupTitle}
            </Text>
          </TouchableOpacity>
        </View>
      ),
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("PostScreen")}>
          <Text style={{ color: "#228ee7", fontSize: 16, paddingRight: 10 }}>
            Posts
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, groupTitle]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
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
        style={{
          // flex: 1,
          // marginBottom: 122,
          // alignSelf: "flex-beginning",
          // alignItems: "flex-beginning",
          //  marginLeft: 10,
          width: "90%",
        }}
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
                  <Text style={{ fontWeight: "bold", color: "#333" }}>
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
                      }}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                  <Text style={{ fontWeight: "bold", color: "#333" }}>
                    {chats.sender_username}
                  </Text>
                  <View style={{ marginHorizontal: 2 }}></View>
                  <Text style={{ fontSize: 10, color: "grey" }}>
                    {moment(chats.iso_time_sent).calendar()}
                    {/* {moment(chats.iso_time_sent)
                      .utc()
                      .utcOffset("-1400")
                      .calendar()} */}
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
          borderColor: "#ddd",
          borderTopWidth: 1,
        }}
      >
        <Formik
          // need title and message - hashtags????? Add those later??????
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
              <Text>{error}</Text>
              <Text style={{ textAlign: "center", color: "red" }}>
                <ErrorMessage name="mymessage" />
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  paddingRight: 50,
                  paddingLeft: 30,
                  marginVertical: -18,
                }}
              >
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    padding: 10,
                    fontSize: 18,
                    borderRadius: 6,
                    minWidth: "90%",
                    maxWidth: "90%",
                    alignItems: "stretch",
                  }}
                  placeholder="Send message..."
                  onChangeText={props.handleChange("mymessage")}
                  value={props.values.mymessage}
                  marginBottom={10}
                />
                <TouchableOpacity
                  style={globalStyles.sendButton}
                  onPress={props.handleSubmit}
                >
                  <Text style={globalStyles.primaryButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}
