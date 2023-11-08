import * as React from "react";
import {
  Button,
  TextInput,
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../../styles/global";
const { addMessageSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Entypo";

export default function PostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const isFocused = useIsFocused();

  const groupTitleButton = user.groupName;

  const getPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/groups/${user.currentGroup}/posts`,
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

      setPosts(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getPosts();
  }, [isFocused]);

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
          paddingVertical: 10,
          paddingHorizontal: 10,
          width: "100%",
          minWidth: 300,
          borderWidth: 1,
          borderRadius: 6,
          marginBottom: 10,
          borderColor: "#ddd",
          backgroundColor: "#fdfdfd",
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
            navigation.navigate("ViewPost");
        }}
      >
        <View style={{ paddingHorizontal: 1 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{title}</Text>
          <Text numberOfLines={2} ellipsizeMode="tail">
            {post_author}: {body}
          </Text>
        </View>
        <View style={{ paddingVertical: 2 }}></View>
        <Text>
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Posts",
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("CreatePost")}>
          {/* <Text style={{ color: "#228ee7", fontSize: 16, paddingRight: 10 }}>
            New
          </Text> */}
          <Icon name="new-message" size={30} color="#4F8EF7" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        margin: 10,
      }}
    >
      <View style={{ backgroundColor: "#f1f1f1", width: "100%" }}>
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.post_id}
        />
      </View>
    </View>
  );
}
