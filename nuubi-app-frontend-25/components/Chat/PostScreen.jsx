import * as React from "react";
import {
  Button,
  TextInput,
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { globalStyles } from "../../styles/global";
const { addMessageSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";
import { loginStyles } from "../../styles/loginStyles";

export default function PostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const isFocused = useIsFocused();
  const [selectedTab, setSelectedTab] = React.useState("Posts");
  const screenWidth = Dimensions.get("window").width;

  const groupTitle = user.groupName;

  const getPosts = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/${user.currentGroup}/posts`,
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
    setSelectedTab("Posts");
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
          padding: 16,
          minWidth: 300,
          borderWidth: 1,
          borderRadius: 16,
          marginHorizontal: 16,
          marginVertical: 8,
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
          <Text
            style={{
              color: "#111111",
              fontSize: 18,
              fontFamily: "Poppins_600SemiBold",
            }}
          >
            {title}
          </Text>
          <Text
            style={globalStyles.body2Regular}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {post_author}: {body}
          </Text>
        </View>
        <View style={{ paddingVertical: 2 }}></View>
        <Text style={globalStyles.body2Regular}>
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
              navigation.navigate("Group Chat");
              setSelectedTab("Chat");
            }}
          >
            <View
              style={[
                globalStyles.topNavTab,
                selectedTab === "Chat" && globalStyles.topNavTabSelected,
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
              //  navigation.navigate("PostScreen");
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

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 8,
        backgroundColor: "#fdfdfd",
      }}
    >
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.post_id}
      />
      <View style={{ marginHorizontal: 16, marginVertical: 16 }}>
        <TouchableOpacity
          style={loginStyles.loginButton}
          accessibilityRole="button"
          onPress={() => {
            navigation.navigate("CreatePost");
          }}
        >
          <Text style={loginStyles.loginButtonText}>Create Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
