import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Math,
} from "react-native";
import { globalStyles } from "../../styles/global";

const dimensions = Dimensions.get("window");

export default function HelpScreen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Nuubi How-To",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView
      style={{
        backgroundColor: "#fdfdfd",
      }}
    >
      <View
        style={{
          flex: 1,
          //  alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fdfdfd",
          paddingBottom: 100,
        }}
      >
        <Text style={styles.header}>0. Where can I find Nuubi? </Text>
        <Text style={styles.text}>
          Nuubi is available at www.nuubi.app on the web, as well as iOS and
          Android app stores.
        </Text>

        <Text style={styles.header}>1. How do I create an account? </Text>
        <Text style={styles.text}>1. Click on “Sign up” </Text>
        <Text style={styles.text}>2. Enter your school email address</Text>
        <Text style={styles.text}>
          3. Set a password, and then click “Sign up”
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/signup.png")}
            resizeMode="center"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/signup2.png")}
            resizeMode="center"
          />
        </View>
        <Text style={styles.header}>2. How do I join a private group? </Text>
        <Text style={styles.text}>1. You will need:</Text>
        <Text style={styles.indentText}>
          1. Admin username “UsernameExample”
        </Text>
        <Text style={styles.indentText}>
          2. 6 digit group invite passcode “123456”
        </Text>
        <Text style={styles.text}>
          2. From the home page, click on the + sign in the upper right corner
        </Text>
        <Text style={styles.text}>3. Click on “Join group with passcode”</Text>
        <Text style={styles.text}>4. Enter Admin username and Passcode</Text>
        <Text style={styles.text}>
          5. You should see a message saying “Successfully added”
        </Text>
        <Text style={styles.text}>
          6. Go back to the home screen. Now you can see the group.
        </Text>
        <Text style={styles.text}>7. Click on the group to view it.</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/plusIcon.png")}
            resizeMode="center"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/joinPrivate.png")}
            resizeMode="center"
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/joinPrivate2.png")}
            resizeMode="center"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/myGroup.png")}
            resizeMode="center"
          />
        </View>

        <Text style={styles.header}>
          3. How do I invite someone to my private group?
        </Text>
        <Text style={styles.text}>
          Give them the Admin username, along with the group passcode. Send them
          instructions from #2
        </Text>

        <Text style={styles.header}>
          4. How do I find my group invite passcode & admin username?
        </Text>
        <Text style={styles.text}>
          1. From the home screen, click on the group you want to see the
          passcode of. This will bring you to the chat screen.
        </Text>
        <Text style={styles.text}>
          2. From the chat screen, click on the group name in blue at the top of
          the page. This will bring you to the group info screen.
        </Text>
        <Text style={styles.text}>
          3. At the top of the group info screen there is an “Invite passcode”
          with a 6 digit code. You can also see who the Admin is from the list
          of members. Both the passcode and Admin username are required to join
          a group.
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/myGroup.png")}
            resizeMode="center"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/groupInfo.png")}
            resizeMode="center"
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.5,
              height: dimensions.height * 0.5,
            }}
            source={require("../../assets/helpScreen/passcodeAdmin.png")}
            resizeMode="center"
          />
        </View>

        <Text style={styles.header}>
          5. How do I see the points of each member in a group?
        </Text>
        <Text style={styles.text}>
          Navigate to the group info screen {"("}#4 Steps 1 & 2{")"} to see a
          list of members in the group, along with the amount of points each
          user has in that group.
        </Text>

        <Text style={styles.header}>
          6. How do I edit my group information, where I'm the admin?
        </Text>
        <Text style={styles.text}>
          Navigate to the group info screen {"("}#4 Steps 1 & 2{")"}. At the
          bottom, there is an Edit button
          {"("}only visible to Admin{")"}. Click this button to change the group
          info and/or visibility.
        </Text>

        <Text style={styles.header}>7. How do I create my own group? </Text>
        <Text style={styles.text}>
          1. From the home page, click on the + sign in the upper right corner
        </Text>
        <Text style={styles.text}>2. Click on “Create new group”</Text>
        <Text style={styles.text}>
          3. Enter the group information and select whether it will be private
          or public. It’s private by default. You can edit these later. Then
          click “Create Group”
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/plusIcon.png")}
            resizeMode="center"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/newGroup.png")}
            resizeMode="center"
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/newGroup2.png")}
            resizeMode="center"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/myGroup.png")}
            resizeMode="center"
          />
        </View>

        <Text style={styles.header}>
          8. How do I find the Posts Screen {"("}for posts and discussion
          questions?{")"}
        </Text>
        <Text style={styles.text}>
          1. From the home screen, click on the group you want to add a
          discussion or post for. This will bring you to the chat screen.
        </Text>
        <Text style={styles.text}>
          2. From the chat screen, click on the post icon at the upper right
          corner at the top of the page. This will bring you to the posts
          screen.
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/myGroup.png")}
            resizeMode="center"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/postsIcon.png")}
            resizeMode="center"
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.5,
              height: dimensions.height * 0.5,
            }}
            source={require("../../assets/helpScreen/postsPage.png")}
            resizeMode="center"
          />
        </View>

        <Text style={styles.header}>9. How do I add a discussion post? </Text>
        <Text style={styles.text}>
          1. Navigate to the Posts Screen {"("}See #8{")"}
        </Text>
        <Text style={styles.text}>
          2. Click on the Write Post button at the top right of the Posts
          screen.
        </Text>
        <Text style={styles.text}>
          3. Fill in the post information and click “Create Post”. You will see
          a message confirming the submission.
        </Text>
        <Text style={styles.text}>
          4. Now when you go back to the Posts screen, you can see the post
          there.
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/newPostIcon.png")}
            resizeMode="center"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/createPost.png")}
            resizeMode="center"
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.5,
              height: dimensions.height * 0.5,
            }}
            source={require("../../assets/helpScreen/postsPage.png")}
            resizeMode="center"
          />
        </View>

        <Text style={styles.header}>
          10. How do I answer a discussion post?
        </Text>
        <Text style={styles.text}>
          1. Navigate to the Posts Screen {"("}See #8{")"}
        </Text>
        <Text style={styles.text}>
          2. Click on the Discussion post you want to answer.
        </Text>
        <Text style={styles.text}>
          3. Type your message in the comment box at the bottom of the page and
          click the submission button.
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/clickPost.png")}
            resizeMode="center"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/answerPost.png")}
            resizeMode="center"
          />
        </View>

        <Text style={styles.header}>11. How do I change my settings?</Text>
        <Text style={styles.text}>
          1. From the home screen, click on the gear icon in the upper left
          corner.
        </Text>
        <Text style={styles.text}>
          2. This will bring you to the settings page, where you can change your
          username and password.
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/settings.png")}
            resizeMode="center"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/viewSettings.png")}
            resizeMode="center"
          />
        </View>

        <Text style={styles.header}>
          12. How do I get help if I have more questions?
        </Text>
        <Text style={styles.text}>
          Email support@nuubi.app and we'll get back to you by the end of the
          next business day.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: "#4d4d4d",
    paddingTop: 10,
    marginLeft: 15,
    marginRight: 25,
    fontFamily: "Futura",
  },
  indentText: {
    fontSize: 18,
    color: "#4d4d4d",
    fontFamily: "Futura",
    paddingTop: 10,
    marginLeft: 15,
    marginRight: 25,
    paddingLeft: 15,
  },
  header: {
    fontSize: 18,
    color: "#333",
    paddingTop: 20,
    marginLeft: 15,
    marginRight: 25,
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "left",
  },
});
