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
} from "react-native";
import { Formik, ErrorMessage } from "formik";
const { addMessageSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import socket from "../../socket";
import moment from "moment";
import { globalStyles } from "../../styles/global";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import FAIcon from "@expo/vector-icons/FontAwesome";

export default function ChatScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [chats, setChats] = React.useState([]);
  // const [groupTitle, setGroupTitle] = React.useState(title);
  const [groupTitle, setGroupTitle] = React.useState(user.groupName);
  const [adminId, setAdminId] = React.useState(null);
  const isFocused = useIsFocused();
  const [likes, setLikes] = React.useState([]);
  const [isChanged, setIsChanged] = React.useState(false);
  const height = useHeaderHeight();
  const [selectedTab, setSelectedTab] = React.useState("Chat");
  const screenWidth = Dimensions.get("window").width;

  const scrollViewRef = React.useRef();

  const getGroupName = async () => {
    try {
      const response = await fetch(
        //  `https://coral-app-n96bn.ondigitalocean.app/groups/getgroupinfo`,
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
        // `https://coral-app-n96bn.ondigitalocean.app/groups/getgroupinfo`,
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
    setSelectedTab("Chat");
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
    getGroupName();
    getChats();
    getIsAdmin();
    getGroupInfo();
  }, [isFocused, user.currentGroup]);

  React.useEffect(() => {
    socket.on("insert msg return updated list", (jsonData) => {
      setChats(jsonData);
      getChats();
    });
  }, [chats]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: screenWidth > 500 ? "space-evenly" : "space-evenly",
            marginTop: 8,
            width: screenWidth > 500 ? screenWidth : "100%",
            marginLeft: screenWidth > 500 ? 0 : "-10%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate("Group Chat");
              setSelectedTab("Chat");
            }}
          >
            <View
              style={[
                {
                  borderBottomWidth: 0,
                  borderColor: "transparent",
                  marginBottom: 12,
                },
                selectedTab === "Chat" && {
                  borderBottomWidth: 2,
                  borderColor: "#FDFDFD",
                },
              ]}
            >
              <Text
                style={{
                  color: "#FDFDFD",
                  fontSize:
                    groupTitle.length >= 12 && screenWidth < 500 ? 14 : 18,
                  fontFamily: "Poppins_600SemiBold",
                  letterSpacing: 0,
                }}
              >
                Chat
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("GroupInfo");
              setSelectedTab("Group");
            }}
          >
            <View
              style={[
                globalStyles.topNavTab,
                selectedTab === "Group" && globalStyles.topNavTabSelected,
              ]}
            >
              <Text
                style={{
                  color: "#FDFDFD",
                  fontSize:
                    groupTitle.length >= 12 && screenWidth < 500 ? 14 : 18,
                  fontFamily: "Poppins_600SemiBold",
                  letterSpacing: 0,
                }}
              >
                {groupTitle + ">"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("PostScreen");
              setSelectedTab("Posts");
            }}
          >
            <View
              style={[
                globalStyles.topNavTab,
                selectedTab === "Posts" && globalStyles.topNavTabSelected,
              ]}
            >
              <Text
                style={{
                  color: "#FDFDFD",
                  fontSize:
                    groupTitle.length >= 12 && screenWidth < 500 ? 14 : 18,
                  fontFamily: "Poppins_600SemiBold",
                  letterSpacing: 0,
                }}
              >
                Posts
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, selectedTab, user]);

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
                  padding: 8,
                  marginTop: 10,
                  marginRight: 40,
                  elevation: 15,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  minWidth: "90%",
                  borderRadius: 16,
                  alignSelf: "left",
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
                      color: "#2482AA",
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
                      textAlign: "center",
                      fontSize: 14,
                      fontFamily: "Poppins_600SemiBold",
                      color: chats.user_id === adminId ? "#111111" : "#333",
                    }}
                  >
                    {chats.sender_username}
                  </Text>
                  <View style={{ marginHorizontal: 2 }}></View>
                  <Text style={{ fontSize: 10, color: "grey" }}>
                    {moment(chats.iso_time_sent).calendar()}
                  </Text>
                </View>
                <Text
                  style={{
                    paddingLeft: 4,
                    color: "#111111",
                    fontFamily: "Poppins_400Regular",
                    fontSize: 14,
                    letterSpacing: 0.5,
                  }}
                >
                  {chats.text}
                </Text>
              </View>
            );
          })}
      </ScrollView>

      <View
        style={{
          width: "100%",
          paddingVertical: 20,
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
              <Text style={globalStyles.captionError}>
                <ErrorMessage name="mymessage" />
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  borderRadius: 16,
                  minWidth: "90%",
                  maxWidth: "90%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#fdfdfd",
                  elevation: 15,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  shadowColor: "#333333",
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  shadowOffset: {
                    width: 0.8,
                    height: 0.8,
                  },
                  overflow: "visible",
                  alignSelf: "center",
                }}
              >
                <TextInput
                  style={{
                    minWidth: "85%",
                    maxWidth: "85%",
                    fontFamily: "Poppins_400Regular",
                    fontSize: 18,
                    letterSpacing: 0.5,
                    alignContent: "center",
                    color: "#767676",
                    paddingLeft: 18,
                  }}
                  placeholder="Send message... "
                  onChangeText={props.handleChange("mymessage")}
                  value={props.values.mymessage}
                  multiline={true}
                />
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
                  <FAIcon name="arrow-up" size={30} color="#fdfdfd" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}
