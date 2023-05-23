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
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import socket from "../../socket";
const { addCommentSchema } = require("../validationSchema");
import moment from "moment";
import { useHeaderHeight } from "@react-navigation/elements";

export default function ViewPostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [postPoints, setPostPoints] = React.useState(0);
  const [postInfo, setPostInfo] = React.useState({
    post_title: "loading",
    body_text: "loading",
    post_author: "loading",
    iso_time_sent: "2000-01-01T01:00:00.000000",
  });
  const [likes, setLikes] = React.useState([]);
  const [isChanged, setIsChanged] = React.useState(false);
  const [postLiked, setPostLiked] = React.useState(false);
  const height = useHeaderHeight();

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

  const isAuthor = user.username === user.post_author ? true : false;

  React.useEffect(() => {
    getPostInfo();
    getComments();
    getPostPoints();
    getLikes();
    getPostLiked();
  }, [user]);

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
      title: "View Post",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  // const KeyboardBehavior = Platform.OS === "ios" ? "padding" : "false";
  const KeyboardBehavior = Platform.OS === "android" ? "false" : "padding";

  return (
    <KeyboardAvoidingView
      behavior={KeyboardBehavior}
      keyboardVerticalOffset={height}
      style={{
        flex: 1,
        backgroundColor: "#f1f1f1",
        justifyContent: "center",
      }}
    >
      <ScrollView>
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
              backgroundColor: "#fdfdfd",
              width: "100%",
              borderRadius: 6,
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
                      color: postLiked ? "#228ee7" : "#bbb",
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
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#333",
                }}
              >
                {/* {user.post_title} */}
                {postInfo.post_title}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  paddingHorizontal: 10,
                  paddingBottom: 5,
                  color: "#333",
                }}
              >
                {/* {user.post_author}: {user.post_body} */}
                {postInfo.post_author}: {postInfo.body_text}
              </Text>
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
                      backgroundColor: "#1aa7ec",
                      borderRadius: 5,
                    }}
                    onPress={() => navigation.navigate("EditPost")}
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
              fontWeight: "bold",
              fontSize: 16,
              color: "#333",
              paddingBottom: 10,
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
                    borderRadius: 6,
                    borderWidth: 1,
                    marginBottom: 10,
                    padding: 5,
                    paddingBottom: 10,
                    backgroundColor: "#fdfdfd",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "bold", color: "#333" }}>
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
                  <Text style={{ color: "#333" }}>{comments.comment_text}</Text>
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
              <Text style={{ textAlign: "center", color: "red" }}>
                <ErrorMessage name="mycomment" />
              </Text> */}
              <View
                style={{
                  flexDirection: "row",
                  paddingRight: 60,
                  paddingLeft: 30,
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
                    backgroundColor: "#fdfdfd",
                  }}
                  placeholder="Add comment..."
                  onChangeText={props.handleChange("mycomment")}
                  value={props.values.mycomment}
                />
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 10,
                    backgroundColor: "#1aa7ec",
                    borderRadius: 6,
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
