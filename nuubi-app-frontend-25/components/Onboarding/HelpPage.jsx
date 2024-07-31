import * as React from "react";
import { View, Text, ScrollView, Image, Dimensions } from "react-native";
import { globalStyles } from "../../styles/global";

const dimensions = Dimensions.get("window");

export default function HelpScreen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Nuubi Help</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView
      style={{
        backgroundColor: "#fbfbfb",
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          backgroundColor: "#fbfbfb",
          margin: 16,
        }}
      >
        <Text style={globalStyles.headingText}>0. Where can I find Nuubi?</Text>
        <Text style={globalStyles.bodyRegular}>
          Nuubi is available at www.nuubi.app on the web, as well as iOS and
          Android app stores.
        </Text>

        <Text style={globalStyles.headingText}>
          1. How do I create an account?{" "}
        </Text>
        <Text style={globalStyles.bodyRegular}>
          1. Click on “Sign up” on your browser or smart device
        </Text>
        <Text style={globalStyles.bodyRegular}>
          2. Enter your school/personal email address
        </Text>
        <Text style={globalStyles.bodyRegular}>
          3. Set a password, and then click “Sign up”
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/signup.png")}
            resizeMode="contain"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/signup2.png")}
            resizeMode="contain"
          />
        </View>
        <Text style={globalStyles.headingText}>
          2. How do I join a private group?{" "}
        </Text>
        <Text style={globalStyles.bodyRegular}>
          1. Before you begin, you will need:
        </Text>
        <Text style={[globalStyles.bodyRegular, { marginLeft: 18 }]}>
          A. Find out the username of the admin of the group
        </Text>
        <Text style={[globalStyles.bodyRegular, { marginLeft: 18 }]}>
          B. The 6 digit passcode assigned to the group
        </Text>
        <Text style={globalStyles.bodyRegular}>
          2. On the home page press the “+” sign in the middle on the bottom
        </Text>
        <Text style={globalStyles.bodyRegular}>
          3. Next select “Join group with passcode”
        </Text>
        <Text style={globalStyles.bodyRegular}>
          4. Enter the Admin username and Passcode in the designated boxes
        </Text>
        <Text style={globalStyles.bodyRegular}>
          5. You should see a message saying “Successfully added 😘”
        </Text>
        <Text style={globalStyles.bodyRegular}>
          6. From the home screen you should see that you are in the group and
          can view it by clicking on it
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/plusIcon.png")}
            resizeMode="contain"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/joinPrivate.png")}
            resizeMode="contain"
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/joinPrivate2.png")}
            resizeMode="contain"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/myGroup.png")}
            resizeMode="contain"
          />
        </View>

        <Text style={globalStyles.headingText}>
          3. How do I invite someone to my private group?
        </Text>
        <Text style={globalStyles.bodyRegular}>
          Give them the admin username and group passcode and have them do the
          steps from #2.
        </Text>

        <Text style={globalStyles.headingText}>
          4. How do I find my group invite passcode & admin username?
        </Text>
        <Text style={globalStyles.bodyRegular}>
          1. From the home screen, click on the group you want to see the
          passcode of. This will bring you to the chat screen.
        </Text>
        <Text style={globalStyles.bodyRegular}>
          2. From the chat screen, click on the group name in blue at the top of
          the page. This will bring you to the group info screen.
        </Text>
        <Text style={globalStyles.bodyRegular}>
          3. At the top of the group info screen there is an “Invite passcode”
          with a 6 digit code along with the Admin username and username of the
          other members.
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/myGroup.png")}
            resizeMode="contain"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/groupInfo.png")}
            resizeMode="contain"
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.5,
              height: dimensions.height * 0.5,
            }}
            source={require("../../assets/helpScreen/passcodeAdmin.png")}
            resizeMode="contain"
          />
        </View>

        <Text style={globalStyles.headingText}>
          5. How do I see the points of each member in a group?
        </Text>
        <Text style={globalStyles.bodyRegular}>
          Go to the group info screen {"("}Steps 1 & 2 from #4{")"} to see the
          list of group members, along with the amount of points each user has
          in that group.
        </Text>

        <Text style={globalStyles.headingText}>
          6. How do I edit my group information, where I'm the admin?
        </Text>
        <Text style={globalStyles.bodyRegular}>
          Go to the group info screen. At the bottom, there is an Edit button
          {"("}Only the Admin can see this{")"}. Click this button to change the
          group info such as the Group name, group description, and change the
          group to private or public under visibility.
        </Text>

        <Text style={globalStyles.headingText}>
          7. How do I create my own group?{" "}
        </Text>
        <Text style={globalStyles.bodyRegular}>
          1. From the home page, select the + sign on the bottom of the page in
          the middle
        </Text>
        <Text style={globalStyles.bodyRegular}>
          2. Next select “Create New Group”{" "}
        </Text>
        <Text style={globalStyles.bodyRegular}>
          3. Enter your group's information: the group name, group description,
          and whether you want it to be a public or private group.
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/plusIcon.png")}
            resizeMode="contain"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/newGroup.png")}
            resizeMode="contain"
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/newGroup2.png")}
            resizeMode="contain"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/myGroup.png")}
            resizeMode="contain"
          />
        </View>

        <Text style={globalStyles.headingText}>
          8. How do I find the Posts Screen {"("}for posts and discussion
          questions?{")"}
        </Text>
        <Text style={globalStyles.bodyRegular}>
          1. From the home screen, choose which group you want to create a
          discussion or post for and select it.
        </Text>
        <Text style={globalStyles.bodyRegular}>
          2. This will bring you to the chat screen, from there in the top right
          corner select the post icon and there you can see the group posts.
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/myGroup.png")}
            resizeMode="contain"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/postsIcon.png")}
            resizeMode="contain"
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.5,
              height: dimensions.height * 0.5,
            }}
            source={require("../../assets/helpScreen/postsPage.png")}
            resizeMode="contain"
          />
        </View>

        <Text style={globalStyles.headingText}>
          9. How do I add a discussion post?{" "}
        </Text>
        <Text style={globalStyles.bodyRegular}>1. Repeat steps from #8.</Text>
        <Text style={globalStyles.bodyRegular}>
          2. From the posts screen select the pen and pad in the top right
          corner. This is the “Create Post” icon.
        </Text>
        <Text style={globalStyles.bodyRegular}>
          3. Fill in your posts information: The post title, the content of your
          post in the post box, and you decide to you can add a photo.
        </Text>
        <Text style={globalStyles.bodyRegular}>
          4. Once your information is filled out you can select create post and
          you see a text stating that your post is created.
        </Text>
        <Text style={globalStyles.bodyRegular}>
          5. If you return to your posts screen you can see your post.
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/newPostIcon.png")}
            resizeMode="contain"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/createPost.png")}
            resizeMode="contain"
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.5,
              height: dimensions.height * 0.5,
            }}
            source={require("../../assets/helpScreen/postsPage.png")}
            resizeMode="contain"
          />
        </View>

        <Text style={globalStyles.headingText}>
          10. How do I answer a discussion post?
        </Text>
        <Text style={globalStyles.bodyRegular}>1. Repeat steps from #8.</Text>
        <Text style={globalStyles.bodyRegular}>
          2. Select the discussion post you want to answer.
        </Text>
        <Text style={globalStyles.bodyRegular}>
          3. Type your message in the comment box at the bottom of the page and
          click “Send” when you want to submit your comment.
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/clickPost.png")}
            resizeMode="contain"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/answerPost.png")}
            resizeMode="contain"
          />
        </View>

        <Text style={globalStyles.headingText}>
          11. How do I change my settings?
        </Text>
        <Text style={globalStyles.bodyRegular}>
          1. Select your “Profile Page” icon in the bottom right of the home
          screen it. It should like the outline of a person.
        </Text>
        <Text style={globalStyles.bodyRegular}>2. Next, select settings.</Text>
        <Text style={globalStyles.bodyRegular}>
          3. Here you can change your username, password, and sign out and
          delete your account.
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/settings.png")}
            resizeMode="contain"
          />
          <Image
            style={{
              width: dimensions.width * 0.45,
              height: dimensions.height * 0.45,
            }}
            source={require("../../assets/helpScreen/viewSettings.png")}
            resizeMode="contain"
          />
        </View>

        <Text style={globalStyles.headingText}>
          12. How do I get help if I have more questions?
        </Text>
        <Text style={globalStyles.bodyRegular}>
          Email our support at support@nuubi.app and we’ll get back to you as
          soon as we can.
        </Text>
      </View>
    </ScrollView>
  );
}
