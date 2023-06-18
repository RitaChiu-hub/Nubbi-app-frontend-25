import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  PixelRatio,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { addMessageSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import socket from "../../socket";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";

export default function ChatScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [chats, setChats] = React.useState([]);
  const [groupTitle, setGroupTitle] = React.useState(user.groupName);
  const [adminId, setAdminId] = React.useState(null);
  const isFocused = useIsFocused();
  const [likes, setLikes] = React.useState([]);
  const [isChanged, setIsChanged] = React.useState(false);
  const height = useHeaderHeight();

  const [image, setImage] = React.useState(null);
  const [ImageSource, setImageSource] = React.useState(null);
  const [ImageData, setImageData] = React.useState(null);
  const [mybase64, setBase64] = React.useState(null);
  const [imageExample, setImageExample] = React.useState(null);
  const [myBinary, setMyBinary] = React.useState(null);

  const cloudName = "dvvdc9evd";
  const apiKey = "971765162862783";
  const uploadPreset = "YOUR_UPLOAD_PRESET";
  const cloudinaryBaseUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const scrollViewRef = React.useRef();

  pickImage = async () => {
    let response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    if (!response.canceled) {
      // console.log("response was NOT canceled!!! :" + response.assets[0].uri);
      setImage(response.assets[0].uri);
      setImageSource(response.assets[0].uri);
      setBase64(response.assets[0].base64);
      // setMyBinary(binEncode(response.assets[0].base64));
    }
  };

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
              // numberOfLines={2}
              style={{
                fontWeight: "bold",
                // color: "#228ee7",
                color: "#4F8EF7",
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
          <View style={{ flex: 1, justifyContent: "row" }}>
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
                  {/* <Text style={{ fontWeight: "bold", color: "#333" }}> */}
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
              {/* style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 12,
                marginHorizontal: 20,
                paddingHorizontal: 10,
              }}
            > */}
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
                  <TouchableOpacity onPress={pickImage}>
                    <MaterialIcon
                      name="add-a-photo"
                      size={30}
                      color="#4F8EF7"
                    />
                  </TouchableOpacity>
                  <View style={{ padding: 5 }}></View>
                  <TouchableOpacity onPress={props.handleSubmit}>
                    <FAIcon name="send" size={30} color="#4F8EF7" />
                  </TouchableOpacity>
                </View>
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 300, height: 200, marginBottom: 5 }}
                  />
                )}
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingTop: 20,
  },

  ImageContainer: {
    borderRadius: 10,
    width: 250,
    height: 250,
    borderColor: "#9B9B9B",
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CDDC39",
  },

  TextInputStyle: {
    textAlign: "center",
    height: 40,
    width: "80%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#028b53",
    marginTop: 20,
  },

  button: {
    width: "80%",
    backgroundColor: "#00BCD4",
    borderRadius: 7,
    marginTop: 20,
  },

  TextStyle: {
    color: "#fff",
    textAlign: "center",
    padding: 10,
  },
  readyText: {
    marginTop: 20,
    textAlign: "center",
  },
  image: {
    width: 300,
    height: 300,
  },
});
