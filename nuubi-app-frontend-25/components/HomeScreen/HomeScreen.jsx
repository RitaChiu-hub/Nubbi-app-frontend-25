import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { AccountContext } from "../AccountContext";
import socket from "../../socket";
import { globalStyles } from "../../styles/global";
import { AntDesign } from "@expo/vector-icons";
import HomeScreenTasks from "./HomeScreenTasks";
import HomeScreenLeaderboard from "./HomeScreenLeaderboard";
import HomeScreenBadges from "./HomeScreenBadges";
import { Overlay } from "react-native-elements";
import { useAssets } from "expo-asset";
import {
  useIsFocused,
  useRoute,
  useNavigation,
} from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";

export default function HomeScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true); // To handle async loading
  const [forYouScreen, setForYouScreen] = React.useState(true);
  const [selectedTab, setSelectedTab] = React.useState("Home");
  const [myUsername, setMyUsername] = React.useState("");
  const [modalTheme, setModalTheme] = React.useState("Finished");
  const route = useRoute();

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  // For Mobile: Retrieve token from SecureStore
  async function getTokenFromSecureStore() {
    try {
      const token = await SecureStore.getItemAsync("token");
      return token || null;
    } catch (error) {
      return null;
    }
  }

  // For Web
  async function checkWebLogin() {
    try {
      const response = await fetch(`http://localhost:8080/auth/checkweblogin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...user }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return data.isLoggedIn; // Assuming the backend returns { isLoggedIn: true/false }
    } catch (error) {
      console.error("Error checking login status:", error);
      return false; // Default to false if there's an error
    }
  }

  // Check if user is logged in (cross-platform)
  async function checkIsLoggedIn() {
    if (Platform.OS === "web") {
      // Web: Use the new checkWebLogin function
      return await checkWebLogin();
    } else {
      // Mobile: Check SecureStore
      const token = await getTokenFromSecureStore();
      return !!token; // Check if token exists
    }
  }

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await checkIsLoggedIn(); // Call the async login check
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus(); // Run the check when the component mounts
  }, [user.loggedIn]);

  // // For Web
  // function getTokenFromCookies() {
  //   const cookies = document.cookie.split("; ");
  //   const tokenCookie = cookies.find((row) => row.startsWith("token="));
  //   return tokenCookie ? tokenCookie.split("=")[1] : null;
  // }

  // // For Mobile
  // async function getTokenFromSecureStore() {
  //   try {
  //     const user = await SecureStore.getItemAsync("user");
  //     if (user) {
  //       const parsedUser = JSON.parse(user);
  //       return parsedUser.token || null;
  //     }
  //   } catch (error) {
  //     console.error("Error retrieving token from SecureStore", error);
  //     return null;
  //   }
  // }

  // // Check if user is logged in (cross-platform)
  // async function checkIsLoggedIn() {
  //   if (Platform.OS === "web") {
  //     // Web: Check the cookies
  //     const token = getTokenFromCookies();
  //     return !!token;
  //   } else {
  //     // Mobile: Check SecureStore
  //     const token = await getTokenFromSecureStore();
  //     return !!token;
  //   }
  // }

  // React.useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     const loggedIn = await checkIsLoggedIn(); // Call the async login check
  //     if (loggedIn === true) {
  //       socket.connect();
  //     } else {
  //       socket.disconnect();
  //     }
  //     setIsLoggedIn(loggedIn);
  //     setLoading(false); // Loading is done
  //   };

  //   checkLoginStatus(); // Run the check when the component mounts
  // }, [user.loggedIn]);

  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();

  async function registerForPushNotificationsAsync() {
    if (Platform.OS !== "web") {
      let token;
      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }

        pushToken = (await Notifications.getExpoPushTokenAsync()).data;

        const token =
          Platform.OS !== "web"
            ? await SecureStore.getItemAsync("token")
            : null; // Get token only on mobile

        // Send the token to the backend API to save it in the user's table
        await fetch("http://localhost:8080/settings/savepushtoken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user, pushToken: pushToken }),
        });
      } catch (error) {
        console.error(error);
      }
      return token;
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {});

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const getUserPoints = async () => {
    const token =
      Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : null; // Get token only on mobile
    try {
      const response = await fetch(
        `http://localhost:8080/groups/getuserpoints`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setMyUsername(jsonData.username);
      setSelectedTab("Home");
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    setSelectedTab("Home");
    getUserPoints(); //for testing purposes
  }, [selectedTab, user]);

  const scrollViewRef = React.useRef();

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true, duration: 1000 });
    }
  };
  // change onboarding to true when ready to demo
  const [performOnboarding, setPerformOnboarding] = React.useState(
    user.firstSignIn == true ? true : false
  );
  // const [performOnboarding, setPerformOnboarding] = React.useState(true);
  const [onboardingState, setOnboardingState] = React.useState(0);
  const [showFinishedPopup, setShowFinishedPopup] = React.useState(false);
  const positionBottom =
    Platform.OS === "web"
      ? [0.4, 0.65, 0.65, 0.35, 0.56, 0.32]
      : [0.1, 0.1, 0.1, 0.25, 0.56, 0.32];
  const positionLeft =
    Platform.OS === "web"
      ? [0.15, 0.04, 0.04, 0.2, 0.1, 0.05]
      : [0.02, 0.25, 0.26, 0.2, 0.1, 0.05];
  const arrowPositionLeft = [0.05, 0.22, 0.61, 0.4, 0.15, 0.1];

  let assets1 = useAssets([require("../../assets/tooltips/ToolCelebrate.png")]);
  let assets2 = useAssets([require("../../assets/tooltips/ToolChat.png")]);
  let assets3 = useAssets([require("../../assets/tooltips/ToolClipboard.png")]);
  let assets4 = useAssets([require("../../assets/tooltips/ToolTimer.png")]);
  let assets5 = useAssets([require("../../assets/tooltips/ToolRocket.png")]);
  let assets6 = useAssets([require("../../assets/tooltips/ToolBadge.png")]);
  let assets7 = useAssets([require("../../assets/tooltips/ToolBrain.png")]);
  let assets8 = useAssets([require("../../assets/tooltips/ToolEyes.png")]);

  const cardIcon =
    Platform.OS == "web"
      ? [
          require("../../assets/tooltips/ToolCelebrate.png"),
          require("../../assets/tooltips/ToolChat.png"),
          require("../../assets/tooltips/ToolClipboard.png"),
          require("../../assets/tooltips/ToolTimer.png"),
          require("../../assets/tooltips/ToolRocket.png"),
          require("../../assets/tooltips/ToolBadge.png"),
          require("../../assets/tooltips/ToolBrain.png"),
          require("../../assets/tooltips/ToolEyes.png"),
        ]
      : [
          assets1[0],
          assets2[0],
          assets3[0],
          assets4[0],
          assets5[0],
          assets6[0],
          assets7[0],
          assets8[0],
        ];

  const titleMessage = [
    "Welcome To Nuubi, " + myUsername + "!",
    // `Welcome To Nuubi, ${myUsername}! Platform: ${Platform.OS}, Onboarding State: ${onboardingState}`,
    "This is the home for your learning groups!",
    "Accounts & Settings",
    "Earn Points with Tasks!",
    "Leaderboard Stats!",
    "Badges Earned!",
  ];
  const secondaryMessage =
    Platform.OS === "web"
      ? [
          "Take a tour of the app so you can see how Nuubi works.",
          "Tap the menu icon in the upper left corner to view your groups for chats and discussions.",
          "You can also update your profile, username, notifications, and more in this side menu.",
          "Get rewarded by asking questions, chatting and learning with peers. Swipe to see all your daily tasks.",
          "Every group has a leaderboard. Swipe to view each group's stats. Increase your chances at leading, the more points you earn!",
          "Find your earned badges here. Earning badges gets you more points!",
        ]
      : [
          "Take a tour of the app so you can see how Nuubi works.",
          "Tap this icon to start group chats and discussions.",
          "Update your profile, username, notifications, and more here.",
          "Get rewarded by asking questions, chatting and learning with peers. Swipe to see all your daily tasks.",
          "Every group has a leaderboard. Swipe to view each group's stats. Increase your chances at leading, the more points you earn!",
          "Find your earned badges here. Earning badges gets you more points!",
        ];

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>My Feed</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      {forYouScreen ? (
        <ScrollView ref={scrollViewRef}>
          <View
            style={{
              height: screenHeight * 0.28,
              minHeight: 200,
              opacity: onboardingState == 3 || onboardingState == 6 ? 1 : 1,
              backgroundColor:
                (performOnboarding == true && onboardingState != 3) ||
                showFinishedPopup == true
                  ? "#BBBBBB"
                  : "#fbfbfb",
            }}
          >
            <HomeScreenTasks />
          </View>
          <View
            style={{
              height: screenHeight * 0.29,
              minHeight: 200,
              opacity: onboardingState == 4 || onboardingState == 6 ? 1 : 1,
              backgroundColor:
                (performOnboarding == true && onboardingState != 4) ||
                showFinishedPopup == true
                  ? "#BBBBBB"
                  : "#fbfbfb",
            }}
          >
            <HomeScreenLeaderboard />
          </View>
          <View
            style={{
              height: screenHeight * 0.24,
              minHeight: 180,
              opacity: onboardingState == 5 || onboardingState == 6 ? 1 : 1,
              backgroundColor:
                (performOnboarding == true && onboardingState != 5) ||
                showFinishedPopup == true
                  ? "#BBBBBB"
                  : "#fbfbfb",
            }}
          >
            <HomeScreenBadges />
          </View>
          <Overlay
            isVisible={performOnboarding}
            overlayStyle={{
              position: "absolute",
              bottom: screenHeight * positionBottom[onboardingState],
              left: screenWidth * positionLeft[onboardingState],
              padding: 0,
              borderRadius: 14,
              shadowColor: "#050505",
              shadowOpacity: 0.8,
              shadowRadius: 2,
            }}
            backdropStyle={{ opacity: 0.1 }}
          >
            {onboardingState == 3 && (
              <View
                style={{
                  position: "absolute",
                  top: -10,
                  left: screenWidth * arrowPositionLeft[onboardingState],
                }}
              >
                <View
                  style={{
                    width: 0,
                    height: 0,
                    borderLeftWidth: 10,
                    borderLeftColor: "transparent",
                    borderRightWidth: 10,
                    borderRightColor: "transparent",
                    borderBottomWidth: 15, // Change from borderTopWidth to borderBottomWidth
                    borderBottomColor: "white", // Change from borderTopColor to borderBottomColor
                  }}
                />
              </View>
            )}

            <View
              style={{
                height: screenHeight * 0.32,
                width: screenWidth * 0.7,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  height: "20%",
                  width: "100%",
                  justifyContent: "flex-end",
                  marginTop: 8,
                }}
              >
                <View style={{ width: "50%", height: "100%" }}></View>
                <View style={{ width: "35%", height: "100%" }}>
                  <Image
                    source={cardIcon[onboardingState]}
                    style={{
                      width: 35,
                      height: 40,
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      resizeMode: "contain",
                    }}
                  />
                </View>
                <View style={{ width: "16%", height: "100%" }}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalTheme("Leaving");
                      setPerformOnboarding(false);
                      setShowFinishedPopup(true);
                    }}
                  >
                    <AntDesign
                      name="close"
                      style={{
                        textAlign: "center",
                        color: "#2482AA",
                        padding: 10,
                      }}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text
                style={{
                  color: "#050505",
                  textAlign: "center",
                  fontSize: 18,
                  fontFamily: "Poppins_600SemiBold",
                  textAlign: "center",
                  paddingHorizontal: 14,
                  paddingBottom: 8,
                }}
              >
                {titleMessage[onboardingState]}
              </Text>
              <View
                style={{
                  alignSelf: "center",
                  paddingHorizontal: 14,
                  paddingBottom: onboardingState != 4 ? 24 : 6,
                }}
              >
                <Text
                  style={[globalStyles.bodyRegular, { textAlign: "center" }]}
                >
                  {secondaryMessage[onboardingState]}
                </Text>
              </View>
              <View
                style={{
                  height: "25%",
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Text style={globalStyles.bodyRegular}>
                  {onboardingState + 1}/6
                </Text>
                <TouchableOpacity
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 30,
                    borderRadius: 60,
                    elevation: 3,
                    backgroundColor: "#2482AA",
                    alignSelf: "center",
                  }}
                  onPress={() => {
                    if (onboardingState < 5) {
                      setOnboardingState(
                        (onboardingState) => onboardingState + 1
                      ); // Advance to the next state
                    } else {
                      setPerformOnboarding(false); // End onboarding
                      setShowFinishedPopup(true); // Show finished popup
                    }
                  }}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    {onboardingState < 5 ? "Next" : "Done"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {onboardingState != 3 &&
              !(
                (Platform.OS == "web" && [0, 1, 2].includes(onboardingState))
                //  (onboardingState == 0 || onboardingState == 1)
              ) && (
                //  onboardingState != 3
                <View
                  style={{
                    position: "absolute",
                    bottom: -10,
                    left: screenWidth * arrowPositionLeft[onboardingState],
                  }}
                >
                  <View
                    style={{
                      width: 0,
                      height: 0,
                      borderLeftWidth: 10,
                      borderLeftColor: "transparent",
                      borderRightWidth: 10,
                      borderRightColor: "transparent",
                      borderTopWidth: 15,
                      borderTopColor: "white",
                    }}
                  />
                </View>
              )}
          </Overlay>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ flex: 0.62 }}>
          <Text>Hello world, no design for this so far. </Text>
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showFinishedPopup}
        onRequestClose={() => {
          setUser({
            ...user,
            firstSignIn: false,
          });
          setOnboardingState(false);
          setPerformOnboarding(false);
          setShowFinishedPopup(false);
        }}
      >
        <View style={globalStyles.centeredView}>
          <View style={globalStyles.modalView}>
            <Image
              source={modalTheme == "Finished" ? cardIcon[6] : cardIcon[7]}
              style={{
                width: 35,
                height: 40,
                resizeMode: "contain",
              }}
            />
            <Text
              style={{
                color: "#050505",
                textAlign: "center",
                fontSize: 18,
                fontFamily: "Poppins_600SemiBold",
                textAlign: "center",
                paddingBottom: 8,
              }}
            >
              {modalTheme == "Finished" ? "You're all set!" : "Skip the Tour?"}
            </Text>
            <Text
              style={{
                color: "#050505",
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                letterSpacing: 0.5,
                textAlign: "center",
              }}
            >
              {modalTheme == "Finished"
                ? "You are now ready to start learning."
                : "No worries. Get the tour later, by going to the FAQs section in your settings."}
            </Text>
            <View style={{ paddingVertical: 10 }}></View>
            <TouchableOpacity
              style={{
                paddingVertical: 14,
                paddingHorizontal: 50,
                borderRadius: 60,
                elevation: 3,
                backgroundColor: "#2482AA",
                alignSelf: "center",
              }}
              onPress={() => {
                setUser({
                  ...user,
                  firstSignIn: false,
                });
                setOnboardingState(false);
                setPerformOnboarding(false);
                setShowFinishedPopup(false);
              }}
            >
              <Text style={globalStyles.primaryButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
