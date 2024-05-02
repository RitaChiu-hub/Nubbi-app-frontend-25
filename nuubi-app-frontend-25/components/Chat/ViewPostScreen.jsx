import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import socket from "../../socket";
const { addCommentSchema } = require("../validationSchema");
import moment from "moment";
import { useHeaderHeight } from "@react-navigation/elements";
import FeatherIcon from "@expo/vector-icons/Feather";
import alert from "./../alert";

export default function ViewPostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [postPoints, setPostPoints] = React.useState(0);
  const [postInfo, setPostInfo] = React.useState({
    post_title: "loading",
    body_text: "loading",
    post_author: "loading",
    image_url: null,
    file_url: null,
    iso_time_sent: "2000-01-01T01:00:00.000000",
  });
  const [likes, setLikes] = React.useState([]);
  const [isChanged, setIsChanged] = React.useState(false);
  const [postLiked, setPostLiked] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState(null);
  const height = useHeaderHeight();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [previewUrls, setPreviewUrls] = React.useState([]);
  const [myUsername, setMyUsername] = React.useState("");

  const getPostLiked = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getpostliked`,
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
      setPostLiked(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getLikes = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getcommentlikes`,
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
          ? [...new Set(jsonData.map((item) => item.comment_id))]
          : [];
      setLikes(myLikes);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getPostInfo = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getpostinfo`,
        // `https://coral-app-n96bn.ondigitalocean.app/groups/getpostinfo`,
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
      setPostInfo(jsonData);
      if (jsonData.file_url !== null) {
        const parts = jsonData.file_url.split("upload/");
        const jpgPart2 = parts[2].split("pdf");
        setPreviewUrl(
          parts[0] +
            "upload/pg_1,q_100/" +
            parts[1] +
            "upload/" +
            jpgPart2[0] +
            "jpg"
        );

        //  const totalPages = 3; // Change this to the total number of pages in your PDF
        const totalPages = jsonData.filePages;
        const urls = [];
        for (let i = 1; i <= totalPages; i++) {
          urls.push(
            parts[0] +
              `upload/pg_${i},q_100/` +
              parts[1] +
              "upload/" +
              jpgPart2[0] +
              "jpg"
          );
        }
        setPreviewUrls(urls);
        //   console.log(jsonData.filePages);
      } else {
        null;
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getPostPoints = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getpostpoints`,
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
      setPostPoints(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getComments = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/${user.currentGroup}/posts/${user.currentPost}/getcomments`,
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
      setComments(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getUserPoints = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getuserpoints`,
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
      // setUserPoints(jsonData.userPoints);
      setMyUsername(jsonData.username);
      // console.log(myUsername)
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getPostInfo();
    getComments();
    getPostPoints();
    getLikes();
    getPostLiked();
    getUserPoints();
  }, [user]);

  const isAuthor = myUsername === user.post_author ? true : false;

  React.useEffect(() => {
    socket.on("insert comment return updated list", (jsonData) => {
      setComments(jsonData);
      getComments();
    });
  }, [socket]);

  React.useEffect(() => {
    socket.on("add post point return updated sum", (jsonData) => {
      setPostPoints(jsonData);
      getPostPoints();
    });
  }, [socket]);

  const addPostPoint = () => {
    socket.emit("add post point return updated sum", { ...user });
    setPostLiked(!postLiked);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingRegular}>View Post</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const KeyboardBehavior = Platform.OS === "android" ? "false" : "padding";

  // console.log("the url has this many pages: " + pdfPages);

  return (
    <KeyboardAvoidingView
      behavior={KeyboardBehavior}
      keyboardVerticalOffset={height}
      style={{
        flex: 1,
        backgroundColor: "#fdfdfd",
        justifyContent: "center",
      }}
    >
      <ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={globalStyles.centeredView}>
            <View style={globalStyles.modalView}>
              <ScrollView>
                {previewUrls.map((url, index) => (
                  <Image
                    key={index}
                    style={{
                      borderRadius: 10,
                      width: 250,
                      height: 350,
                      maxWidth: Dimensions.get("window").width * 0.7,
                      maxHeight: Dimensions.get("window").height * 0.6,
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: 10,
                      marginHorizontal: 10,
                    }}
                    source={{ uri: url }}
                  />
                ))}
              </ScrollView>
              <View style={{ paddingVertical: 10 }}></View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  width: "100%",
                }}
                accessibilityRole="none"
              >
                <TouchableOpacity
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 30,
                    borderRadius: 60,
                    elevation: 3,
                    backgroundColor: "#2482AA",
                  }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={globalStyles.primaryButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 30,
                    borderRadius: 60,
                    elevation: 3,
                    backgroundColor: "#2482AA",
                  }}
                  onPress={() => alert("File Downloads are coming soon!")}
                >
                  <FeatherIcon name="download" color="#fdfdfd" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View
          style={{
            padding: 10,
            width: "100%",
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              width: "100%",
              borderRadius: 16,
              borderColor: "#ddd",
              backgroundColor: "#fdfdfd",
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
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold", color: "#333" }}>
                  {postPoints}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    if (postLiked != true) {
                      setPostPoints(postPoints + 1);
                      setPostLiked(!postLiked);
                    } else {
                      setPostPoints(postPoints - 1);
                      setPostLiked(!postLiked);
                    }

                    fetch(
                      `https://coral-app-n96bn.ondigitalocean.app/groups/addpostpoint`,
                      {
                        method: "POST",
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          ...user,
                        }),
                      }
                    );
                  }}
                >
                  <Text
                    style={{
                      color: postLiked ? "#2482AA" : "#bbb",
                      fontSize: 16,
                      fontWeight: "bold",
                      paddingBottom: 2,
                    }}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginLeft: 10 }}></View>

              <Text
                style={{
                  color: "#111111",
                  fontSize: 18,
                  fontFamily: "Poppins_600SemiBold",
                }}
              >
                {/* {user.post_title} */}
                {postInfo.post_title}
              </Text>
            </View>

            <View>
              <Text style={[globalStyles.bodyRegular, { padding: 14 }]}>
                {postInfo.post_author}: {postInfo.body_text}
              </Text>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {postInfo.image_url === null ? null : (
                  <Image
                    style={{
                      borderRadius: 10,
                      width: 250,
                      height: 250,
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: 10,
                    }}
                    source={{ uri: postInfo.image_url }}
                  />
                )}
              </View>

              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {postInfo.file_url === null ? null : (
                  <View>
                    <View>
                      <Text
                        style={{
                          color: "#111111",
                          fontFamily: "Poppins_500Medium",
                          fontSize: 12,
                          letterSpacing: 0.4,
                          paddingHorizontal: 7,
                          paddingTop: 5,
                        }}
                      >
                        Attached file:{" "}
                      </Text>
                      <TouchableOpacity
                        style={{ paddingHorizontal: 7 }}
                        accessibilityRole="button"
                        onPress={() => setModalVisible(true)}
                        //  onPress={() => alert("Show modal with file Preview")}
                      >
                        <Text
                          style={{
                            color: "#2482AA",
                            fontFamily: "Poppins_500Medium",
                            fontSize: 12,
                            letterSpacing: 0.4,
                            textDecorationLine: "underline",
                          }}
                        >
                          {postInfo.file_url}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontSize: 12,
                  color: "#333",
                  paddingBottom: 10,
                }}
              >
                {moment(postInfo.iso_time_sent).calendar()}
              </Text>

              {isAuthor == true ? (
                <View style={{ paddingRight: 10 }}>
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      marginBottom: 10,
                      //  backgroundColor: "#1aa7ec",
                      backgroundColor: "#2482AA",
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      setUser({
                        ...user,
                        post_title: postInfo.post_title,
                        post_body: postInfo.body_text,
                        post_author: postInfo.post_author,
                        image_url: postInfo.image_url,
                      }),
                        navigation.navigate("EditPost");
                    }}

                    //  onPress={() => navigation.navigate("EditPost")}
                  >
                    <Text style={{ color: "#fdfdfd", fontSize: 14 }}>Edit</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View></View>
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            padding: 10,
            paddingLeft: 10,
          }}
        >
          <Text
            style={{
              color: "#111111",
              fontSize: 18,
              fontFamily: "Poppins_600SemiBold",
              paddingBottom: 10,
              paddingLeft: 4,
            }}
          >
            {user.number_comments}{" "}
            {user.number_comments === "1" ? "Comment:" : "Comments:"}
          </Text>
          {comments &&
            comments.map((comments) => {
              return (
                <View
                  key={comments.post_comment_id}
                  style={{
                    borderColor: "#ddd",
                    borderRadius: 16,
                    borderWidth: 1,
                    marginBottom: 10,
                    padding: 5,
                    paddingBottom: 10,
                    backgroundColor: "#fdfdfd",
                    borderColor: "#ddd",
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
                        color: "#333",
                      }}
                    >
                      {comments.comment_points}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (!likes.includes(comments.post_comment_id)) {
                          likes.push(comments.post_comment_id);
                          setLikes(likes);
                          comments.comment_points++;
                          setIsChanged(!isChanged);
                        } else {
                          const index = likes.indexOf(comments.post_comment_id);
                          likes.splice(index, 1);
                          setLikes(likes);
                          comments.comment_points--;
                          setIsChanged(!isChanged);
                        }

                        fetch(
                          `https://coral-app-n96bn.ondigitalocean.app/groups/addcommentpoint`,
                          {
                            method: "POST",
                            credentials: "include",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              ...user,
                              comment_id: comments.post_comment_id,
                            }),
                          }
                        );
                      }}
                    >
                      <Text
                        style={{
                          color: likes.includes(comments.post_comment_id)
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
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#333",
                        paddingLeft: 5,
                      }}
                    >
                      {comments.sender_username}
                    </Text>
                    <View style={{ marginHorizontal: 2 }}></View>
                    <Text style={{ fontSize: 10, color: "grey" }}>
                      {moment(comments.comment_iso_time_sent).calendar()}
                    </Text>
                  </View>
                  <View style={{ paddingLeft: 4 }}>
                    <Text style={globalStyles.bodyRegular}>
                      {comments.comment_text}
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
      <View
        style={{
          width: "100%",
          paddingBottom: 20,
        }}
      >
        <Formik
          initialValues={{ mycomment: "" }}
          validationSchema={addCommentSchema}
          onSubmit={(values, actions) => {
            const vals = { ...values };
            const uservals = { ...user, ...values };
            actions.resetForm();
            socket.emit("insert comment return updated list", uservals);
            // router.post("/:group_id/posts/:post_id/createcomment", handleCreateComment);
          }}
        >
          {(props) => (
            <View
              style={{
                width: "100%",
              }}
            >
              {/* <Text>{error}</Text>
            <Text style={globalStyles.captionError}>
                <ErrorMessage name="mycomment" />
              </Text> */}
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
                    padding: 10,
                    fontSize: 18,
                    minWidth: "77%",
                    maxWidth: "77%",
                  }}
                  placeholder="Add comment..."
                  onChangeText={props.handleChange("mycomment")}
                  value={props.values.mycomment}
                />
                <TouchableOpacity
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 20,
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
