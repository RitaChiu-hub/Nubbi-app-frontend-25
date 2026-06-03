import * as React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/global";
import { AntDesign } from "@expo/vector-icons";

export default function HelpScreen({ navigation }) {
  const [openSections, setOpenSections] = React.useState({});

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const Section = ({ title, content, sectionKey }) => {
    const isOpen = openSections[sectionKey];
    return (
      <View
        style={{
          borderWidth: 1,
          borderRadius: 16,
          marginVertical: 8,
          borderColor: "#ddd",
          backgroundColor: "#fbfbfb",
          padding: 16,
          marginHorizontal: 16,
          shadowColor: "#333",
          shadowOffset: { width: 0.8, height: 0.8 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <TouchableOpacity
          onPress={() => toggleSection(sectionKey)}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={[
              globalStyles.headingText,
              {
                flex: 1,
                paddingRight: 12,
              },
            ]}
          >
            {title}
          </Text>
          <AntDesign
            name={isOpen ? "close" : "plus"}
            size={20}
            color="#555"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
        {isOpen && (
          <View style={{ marginTop: 12 }}>
            {content.map((c, i) => (
              <Text key={i} style={globalStyles.bodyRegular}>
                {c}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Nuubi FAQ</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView role="main" aria-label="Nuubi FAQ main content" style={{ backgroundColor: "#fbfbfb", padding: 16 }}>
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
          "Students can access Nuubi by creating an account at nuubi.com, or through the Canvas integration if it's enabled for their course.",
        ]}
      />

      <Section
        title="How do I create an account?"
        sectionKey="createAccount"
        content={[
          "1. Visit nuubi.com",
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
          "They can email support@nuubi.com to recover or request deletion of their account.",
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
          "To support group access, participation tracking, analytics, and awarding badges and microcredentials. All data use is compliant with FERPA standards.",
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
          "Users can delete their account anytime via their Profile > Settings page. This will remove all associated data. If they cannot access their account, they can email support@nuubi.com to request deletion.",
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
