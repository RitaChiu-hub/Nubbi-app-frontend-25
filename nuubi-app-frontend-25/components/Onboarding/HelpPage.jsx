import * as React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/global";

export default function HelpScreen({ navigation }) {
  const [openSections, setOpenSections] = React.useState({});

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const Section = ({ title, content, sectionKey }) => (
    <View style={{ marginBottom: 12 }}>
      <TouchableOpacity onPress={() => toggleSection(sectionKey)}>
        <Text style={globalStyles.headingText}>{title}</Text>
      </TouchableOpacity>
      {openSections[sectionKey] &&
        content.map((c, i) => (
          <Text key={i} style={globalStyles.bodyRegular}>
            {c}
          </Text>
        ))}
    </View>
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Nuubi FAQ</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView style={{ backgroundColor: "#fbfbfb", padding: 16 }}>
      {/* GENERAL QUESTIONS */}
      <Section
        title="What is Nuubi?"
        sectionKey="whatIsNuubi"
        content={[
          "Nuubi is a mobile-friendly, gamified peer Q&A plugin that helps university students engage, connect, and succeed through collaborative learning.",
          "It integrates with LMS platforms like Canvas and also comes with a companion mobile app.",
          "Promote community, increase pass rates, and reward soft skills with our peer Q&A plugin and mobile app.",
          "Main features include:",
          "- Q&A forums and group chat",
          "- Mobile app & LTI integration",
          "- Micro-credentials for soft skills",
          "- Built-in gamification features",
          "- Downloadable analytics page",
        ]}
      />

      <Section
        title="Who is Nuubi for?"
        sectionKey="whoIsItFor"
        content={[
          "Nuubi is designed for higher education courses that benefit from peer interaction, collaborative discussion, and ongoing student participation.",
        ]}
      />

      <Section
        title="What makes Nuubi different?"
        sectionKey="whatMakesItDifferent"
        content={[
          "Nuubi offers a social, mobile-first experience with points, badges, and leaderboards to encourage active learning.",
          "Participation earns students microcredentials they can showcase to future employers.",
        ]}
      />

      {/* ACCESS & ACCOUNT */}
      <Section
        title="How do I access Nuubi?"
        sectionKey="access"
        content={[
          "Students can access Nuubi by creating an account at nuubi.app, or through the Canvas integration if it's enabled for their course.",
        ]}
      />

      <Section
        title="How do I create an account?"
        sectionKey="createAccount"
        content={[
          "1. Visit nuubi.app",
          "2. Click 'Sign Up'",
          "3. Enter your email and create a password (min. 8 characters, incl. uppercase, number, special character)",
          "4. Check your email for a 6-digit verification code",
          "5. Enter the code to complete setup and get signed in",
          "Note: We recommend using the mobile app for better login persistence.",
        ]}
      />

      <Section
        title="How do I create or reset my Nuubi password?"
        sectionKey="resetPassword"
        content={[
          "If you normally log in through Canvas and want to access Nuubi directly (like on the mobile app or for account changes), you’ll need to create a separate Nuubi password.",
          "Just click on the 'Forgot/Create Password' button in the app settings or on the login screen.",
          "You’ll receive a passcode via email, and then you can create your secure Nuubi password.",
        ]}
      />

      <Section
        title="What if someone can’t access their account?"
        sectionKey="accountAccess"
        content={[
          "They can email support@nuubi.app to recover or request deletion of their account.",
        ]}
      />

      <Section
        title="Do users need the mobile app?"
        sectionKey="mobileApp"
        content={[
          "No, but it is recommended for mobile access. Students can use the web or the iOS/Android apps. For smoother login persistence, we recommend the app on mobile devices.",
        ]}
      />

      {/* STUDENT EXPERIENCE */}
      <Section
        title="How do I join a group or class?"
        sectionKey="joinGroup"
        content={[
          "After logging in, go to the Groups tab and select 'Add New Group.' You can either:",
          "- Join a private group with a passcode and instructor username",
          "- Discover public groups and join directly",
          "- Create your own group",
        ]}
      />

      <Section
        title="What activities earn points?"
        sectionKey="pointsEarned"
        content={[
          "You earn points for posts, replies, and contributing to group discussions. These points help you earn badges and track soft skill growth.",
        ]}
      />

      <Section
        title="Can I post anonymously?"
        sectionKey="anonymous"
        content={[
          "Yes. Anonymous posting is supported to help students ask questions comfortably while maintaining a respectful environment.",
          "Note: the instructor will be able to see your email associated with your username for the purpose of tracking and rewarding participation.",
        ]}
      />

      <Section
        title="Where can I track my progress?"
        sectionKey="trackProgress"
        content={[
          "In the Progress Dashboard, you’ll see your points, badge achievements, and how your participation compares to others.",
        ]}
      />

      {/* INSTRUCTORS */}
      <Section
        title="How does Nuubi support instructors?"
        sectionKey="instructors"
        content={[
          "Nuubi reduces email volume by giving students a space to ask and answer each other’s questions.",
          "Instructors can monitor all activity, highlight helpful posts, and view engagement analytics.",
        ]}
      />

      <Section
        title="What kind of analytics do instructors get?"
        sectionKey="analytics"
        content={[
          "Instructors can view individual and group analytics to identify top contributors, assess participation trends, and track engagement for grading or feedback.",
        ]}
      />

      <Section
        title="How much setup is needed?"
        sectionKey="setup"
        content={[
          "Minimal. Once integrated in Canvas, instructors simply activate Nuubi from course navigation. We provide onboarding support and setup instructions.",
        ]}
      />

      <Section
        title="Can instructors moderate or manage the group?"
        sectionKey="moderation"
        content={[
          "Yes. Instructors can post announcements, remove content, assign badges, and pin posts.",
        ]}
      />

      {/* CANVAS INTEGRATION */}
      <Section
        title="Is Nuubi integrated with Canvas?"
        sectionKey="canvasIntegration"
        content={[
          "Yes, Nuubi supports LTI 1.3 integration with Canvas. Students can access Nuubi directly from the course navigation menu.",
        ]}
      />

      <Section
        title="What is required to set it up in Canvas?"
        sectionKey="canvasSetup"
        content={[
          "We provide a configuration file (nuubi-lti-config.json) and onboarding instructions. Your tech team can test it in a sandbox environment before full rollout.",
        ]}
      />

      <Section
        title="What data does Nuubi receive from Canvas?"
        sectionKey="canvasData"
        content={[
          "Basic course and user data are shared upon launch for functionality:",
          "- Canvas course and user IDs",
          "- Course enrollment and group participation",
          "- Optional: email and SIS ID if permitted",
          "This is used solely for enabling group access, syncing participants, and tracking engagement.",
        ]}
      />

      <Section
        title="What if our institution uses deep linking or redirect tools?"
        sectionKey="canvasTools"
        content={[
          "We support Canvas variable substitution such as Canvas.user.loginId, Canvas.course.sisSourceId, and others for seamless connection between Canvas and Nuubi. You can customize access links using these variables.",
        ]}
      />

      {/* PRIVACY */}
      <Section
        title="What personal data does Nuubi store?"
        sectionKey="dataStored"
        content={[
          "We store only the minimum required to operate the platform:",
          "- Email (for login and notifications)",
          "- Username (can be anonymous or updated)",
          "- Participation data (posts, messages, points)",
          "- Optional: Canvas identifiers (if integrated)",
        ]}
      />

      <Section
        title="Why is this data collected?"
        sectionKey="dataPurpose"
        content={[
          "To support group access, participation tracking, analytics, and awarding microcredentials. All data use is compliant with FERPA standards.",
        ]}
      />

      <Section
        title="Where is user data stored?"
        sectionKey="dataStorage"
        content={[
          "All user data is stored securely on servers hosted by DigitalOcean, a smaller and secure alternative to AWS. We follow best practices for security, encryption, and access control.",
        ]}
      />

      <Section
        title="How can users delete their data?"
        sectionKey="deleteData"
        content={[
          "Users can delete their account anytime via their Profile > Settings page. This will remove all associated data. If they cannot access their account, they can email support@nuubi.app to request deletion.",
        ]}
      />

      <Section
        title="Does Nuubi sell or share user data?"
        sectionKey="dataSharing"
        content={[
          "No. We do not sell, rent, or share personal data with third parties.",
        ]}
      />
    </ScrollView>
  );
}

// import * as React from "react";
// import { View, Text, ScrollView, Image, Dimensions } from "react-native";
// import { globalStyles } from "../../styles/global";

// const dimensions = Dimensions.get("window");

// export default function HelpScreen({ navigation }) {
//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitle: () => (
//         <Text style={globalStyles.h3HeadingWhite}>Nuubi FAQ</Text>
//       ),
//       headerTitleAlign: "center",
//     });
//   }, [navigation]);

//   return (
//     <ScrollView
//       style={{
//         backgroundColor: "#fbfbfb",
//       }}
//     >
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "space-between",
//           backgroundColor: "#fbfbfb",
//           margin: 16,
//         }}
//       >
//         <Text style={globalStyles.headingText}>0. Where can I find Nuubi?</Text>
//         <Text style={globalStyles.bodyRegular}>
//           Nuubi is available at www.nuubi.app on the web, as well as iOS and
//           Android app stores.
//         </Text>

//         <Text style={globalStyles.headingText}>
//           1. How do I create an account?{" "}
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           1. Click on “Sign up” on your browser or smart device
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           2. Enter your school/personal email address
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           3. Set a password, and then click “Sign up”
//         </Text>
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-around",
//             width: "100%",
//           }}
//         >
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/signup.png")}
//             resizeMode="contain"
//           />
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/signup2.png")}
//             resizeMode="contain"
//           />
//         </View>
//         <Text style={globalStyles.headingText}>
//           2. How do I join a private group?{" "}
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           1. Before you begin, you will need:
//         </Text>
//         <Text style={[globalStyles.bodyRegular, { marginLeft: 18 }]}>
//           A. Find out the username of the admin of the group
//         </Text>
//         <Text style={[globalStyles.bodyRegular, { marginLeft: 18 }]}>
//           B. The 6 digit passcode assigned to the group
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           2. On the home page press the “+” sign in the middle on the bottom
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           3. Next select “Join group with passcode”
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           4. Enter the Admin username and Passcode in the designated boxes
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           5. You should see a message saying “Successfully added 😘”
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           6. From the home screen you should see that you are in the group and
//           can view it by clicking on it
//         </Text>
//         <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/plusIcon.png")}
//             resizeMode="contain"
//           />
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/joinPrivate.png")}
//             resizeMode="contain"
//           />
//         </View>
//         <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/joinPrivate2.png")}
//             resizeMode="contain"
//           />
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/myGroup.png")}
//             resizeMode="contain"
//           />
//         </View>

//         <Text style={globalStyles.headingText}>
//           3. How do I invite someone to my private group?
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           Give them the admin username and group passcode and have them do the
//           steps from #2.
//         </Text>

//         <Text style={globalStyles.headingText}>
//           4. How do I find my group invite passcode & admin username?
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           1. From the home screen, click on the group you want to see the
//           passcode of. This will bring you to the chat screen.
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           2. From the chat screen, click on the group name in blue at the top of
//           the page. This will bring you to the group info screen.
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           3. At the top of the group info screen there is an “Invite passcode”
//           with a 6 digit code along with the Admin username and username of the
//           other members.
//         </Text>

//         <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/myGroup.png")}
//             resizeMode="contain"
//           />
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/groupInfo.png")}
//             resizeMode="contain"
//           />
//         </View>
//         <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//           <Image
//             style={{
//               width: dimensions.width * 0.5,
//               height: dimensions.height * 0.5,
//             }}
//             source={require("../../assets/helpScreen/passcodeAdmin.png")}
//             resizeMode="contain"
//           />
//         </View>

//         <Text style={globalStyles.headingText}>
//           5. How do I see the points of each member in a group?
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           Go to the group info screen {"("}Steps 1 & 2 from #4{")"} to see the
//           list of group members, along with the amount of points each user has
//           in that group.
//         </Text>

//         <Text style={globalStyles.headingText}>
//           6. How do I edit my group information, where I'm the admin?
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           Go to the group info screen. At the bottom, there is an Edit button
//           {"("}Only the Admin can see this{")"}. Click this button to change the
//           group info such as the Group name, group description, and change the
//           group to private or public under visibility.
//         </Text>

//         <Text style={globalStyles.headingText}>
//           7. How do I create my own group?{" "}
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           1. From the home page, select the + sign on the bottom of the page in
//           the middle
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           2. Next select “Create New Group”{" "}
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           3. Enter your group's information: the group name, group description,
//           and whether you want it to be a public or private group.
//         </Text>

//         <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/plusIcon.png")}
//             resizeMode="contain"
//           />
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/newGroup.png")}
//             resizeMode="contain"
//           />
//         </View>
//         <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/newGroup2.png")}
//             resizeMode="contain"
//           />
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/myGroup.png")}
//             resizeMode="contain"
//           />
//         </View>

//         <Text style={globalStyles.headingText}>
//           8. How do I find the Posts Screen {"("}for posts and discussion
//           questions?{")"}
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           1. From the home screen, choose which group you want to create a
//           discussion or post for and select it.
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           2. This will bring you to the chat screen, from there in the top right
//           corner select the post icon and there you can see the group posts.
//         </Text>

//         <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/myGroup.png")}
//             resizeMode="contain"
//           />
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/postsIcon.png")}
//             resizeMode="contain"
//           />
//         </View>
//         <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//           <Image
//             style={{
//               width: dimensions.width * 0.5,
//               height: dimensions.height * 0.5,
//             }}
//             source={require("../../assets/helpScreen/postsPage.png")}
//             resizeMode="contain"
//           />
//         </View>

//         <Text style={globalStyles.headingText}>
//           9. How do I add a discussion post?{" "}
//         </Text>
//         <Text style={globalStyles.bodyRegular}>1. Repeat steps from #8.</Text>
//         <Text style={globalStyles.bodyRegular}>
//           2. From the posts screen select the pen and pad in the top right
//           corner. This is the “Create Post” icon.
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           3. Fill in your posts information: The post title, the content of your
//           post in the post box, and you decide to you can add a photo.
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           4. Once your information is filled out you can select create post and
//           you see a text stating that your post is created.
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           5. If you return to your posts screen you can see your post.
//         </Text>

//         <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/newPostIcon.png")}
//             resizeMode="contain"
//           />
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/createPost.png")}
//             resizeMode="contain"
//           />
//         </View>
//         <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//           <Image
//             style={{
//               width: dimensions.width * 0.5,
//               height: dimensions.height * 0.5,
//             }}
//             source={require("../../assets/helpScreen/postsPage.png")}
//             resizeMode="contain"
//           />
//         </View>

//         <Text style={globalStyles.headingText}>
//           10. How do I answer a discussion post?
//         </Text>
//         <Text style={globalStyles.bodyRegular}>1. Repeat steps from #8.</Text>
//         <Text style={globalStyles.bodyRegular}>
//           2. Select the discussion post you want to answer.
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           3. Type your message in the comment box at the bottom of the page and
//           click “Send” when you want to submit your comment.
//         </Text>

//         <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/clickPost.png")}
//             resizeMode="contain"
//           />
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/answerPost.png")}
//             resizeMode="contain"
//           />
//         </View>

//         <Text style={globalStyles.headingText}>
//           11. How do I change my settings?
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           1. Select your “Profile Page” icon in the bottom right of the home
//           screen it. It should like the outline of a person.
//         </Text>
//         <Text style={globalStyles.bodyRegular}>2. Next, select settings.</Text>
//         <Text style={globalStyles.bodyRegular}>
//           3. Here you can change your username, password, and sign out and
//           delete your account.
//         </Text>

//         <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/settings.png")}
//             resizeMode="contain"
//           />
//           <Image
//             style={{
//               width: dimensions.width * 0.45,
//               height: dimensions.height * 0.45,
//             }}
//             source={require("../../assets/helpScreen/viewSettings.png")}
//             resizeMode="contain"
//           />
//         </View>

//         <Text style={globalStyles.headingText}>
//           12. How do I get help if I have more questions?
//         </Text>
//         <Text style={globalStyles.bodyRegular}>
//           Email our support at support@nuubi.app and we’ll get back to you as
//           soon as we can.
//         </Text>
//       </View>
//     </ScrollView>
//   );
// }
