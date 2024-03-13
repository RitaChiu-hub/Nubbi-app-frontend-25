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
import { useIsFocused } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { HeaderBackButton } from "@react-navigation/elements";

export default function ChatScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [chats, setChats] = React.useState([]);
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
        `https://coral-app-n96bn.ondigitalocean.app/groups/getgroupinfo`,
        // `http://localhost:8080/groups/getgroupinfo`,
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
        // `http://localhost:8080/groups/getgroupinfo`,
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
      headerLeft: () => (
        <HeaderBackButton
          labelVisible={false}
          style={{ maxWidth: 40 }}
          onPress={() => {
            navigation.navigate("MyGroups");
          }}
        />
      ),
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: screenWidth > 500 ? "space-evenly" : "space-around",
            marginTop: 8,
            width: screenWidth > 500 ? screenWidth : "90%",
            marginLeft: screenWidth > 500 ? 0 : "-8%",
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
                  borderColor: "#33B7F0",
                },
              ]}
            >
              <Text
                style={[
                  {
                    color: "#767676",
                    fontSize: 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                  selectedTab === "Chat" && {
                    color: "#33b7f0",
                    fontSize:
                      (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                ]}
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
                style={[
                  {
                    color: "#767676",
                    fontSize:
                      (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                  selectedTab === "Group" && {
                    color: "#33b7f0",
                    fontSize:
                      (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                ]}
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
                style={[
                  {
                    color: "#767676",
                    fontSize:
                      (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                  selectedTab === "Posts" && {
                    color: "#33b7f0",
                    fontSize:
                      (groupTitle.length >= 12) & (screenWidth < 500) ? 14 : 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                ]}
              >
                Posts
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, selectedTab]);

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
                    fontSize: 18,
                    minWidth: "85%",
                    maxWidth: "85%",
                  }}
                  placeholder="   Send message... "
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
