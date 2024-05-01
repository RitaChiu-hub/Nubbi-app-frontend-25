import * as React from "react";
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
import { AccountContext } from "./AccountContext";
import socket from "../socket";
import { globalStyles } from "../styles/global";
import { AntDesign } from "@expo/vector-icons";
import HomeScreenTasks from "./HomeScreen/HomeScreenTasks";
import HomeScreenLeaderboard from "./HomeScreen/HomeScreenLeaderboard";
import HomeScreenBadges from "./HomeScreen/HomeScreenBadges";
import { Overlay } from "react-native-elements";
import { useAssets } from "expo-asset";

export default function HomeScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [forYouScreen, setForYouScreen] = React.useState(true);
  const [selectedTab, setSelectedTab] = React.useState("Home");
  const [myUsername, setMyUsername] = React.useState("");
  const [modalTheme, setModalTheme] = React.useState("Finished");

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  if (user.token != null && user.token != "undefined") {
    React.useEffect(() => {
      socket.connect();
    }, []);
  } else {
    socket.disconnect();
  }

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
      setMyUsername(jsonData.username);
      setSelectedTab("Home");
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    setSelectedTab("Home");
    getUserPoints();
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
  const positionBottom = [0.1, 0.1, 0.1, 0.25, 0.56, 0.41];
  const positionLeft = [0.02, 0.25, 0.26, 0.2, 0.1, 0.05];
  const arrowPositionLeft = [0.05, 0.22, 0.61, 0.4, 0.15, 0.1];

  let assets1 = useAssets([require("../assets/tooltips/ToolCelebrate.png")]);
  let assets2 = useAssets([require("../assets/tooltips/ToolChat.png")]);
  let assets3 = useAssets([require("../assets/tooltips/ToolClipboard.png")]);
  let assets4 = useAssets([require("../assets/tooltips/ToolTimer.png")]);
  let assets5 = useAssets([require("../assets/tooltips/ToolRocket.png")]);
  let assets6 = useAssets([require("../assets/tooltips/ToolBadge.png")]);
  let assets7 = useAssets([require("../assets/tooltips/ToolBrain.png")]);
  let assets8 = useAssets([require("../assets/tooltips/ToolEyes.png")]);

  const cardIcon =
    Platform.OS == "web"
      ? [
          require("../assets/tooltips/ToolCelebrate.png"),
          require("../assets/tooltips/ToolChat.png"),
          require("../assets/tooltips/ToolClipboard.png"),
          require("../assets/tooltips/ToolTimer.png"),
          require("../assets/tooltips/ToolRocket.png"),
          require("../assets/tooltips/ToolBadge.png"),
          require("../assets/tooltips/ToolBrain.png"),
          require("../assets/tooltips/ToolEyes.png"),
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
    "Create Posts, Chats, or Join Groups here!",
    "Accounts & Settings",
    "Earn Points with Tasks!",
    "Leaderboard Stats!",
    "Badges Earned!",
  ];
  const secondaryMessage = [
    "Take a tour of the app so you can see how Nuubi works.",
    "Tap the plus icon to add or join a group; Or create a new post.",
    "Update your profile, username, notifications, and more here.",
    "Get rewarded by asking questions, chatting and learning with peers. Swipe to see all your daily tasks.",
    "Every group has a leaderboard. Swipe to view each group's stats. Increase your chances at leading, the more points you earn!",
    "Find your earned badges here. You can choose to feature 3 of your choice.",
  ];

  React.useLayoutEffect(() => {
    navigation.setOptions({
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
              // navigation.navigate("Home");
              setSelectedTab("Home");
            }}
          >
            <View
              style={[
                {
                  borderBottomWidth: 0,
                  borderColor: "transparent",
                  marginBottom: 12,
                },
                selectedTab === "Home" && {
                  borderBottomWidth: 2,
                  borderColor: "#33B7F0",
                },
              ]}
            >
              <Text
                style={[
                  {
                    color: "#767676",
                    fontSize: 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                  selectedTab === "Home" && {
                    color: "#33b7f0",
                    fontSize: 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                ]}
              >
                For you
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSelectedTab("Groups");
              navigation.navigate("MyGroups");
            }}
          >
            <View
              style={[
                globalStyles.topNavTab,
                selectedTab === "Groups" && globalStyles.topNavTabSelected,
              ]}
            >
              <Text
                style={[
                  {
                    color: "#767676",
                    fontSize: 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                  selectedTab === "Groups" && {
                    color: "#33b7f0",
                    fontSize: 18,
                    fontFamily: "Poppins_600SemiBold",
                    letterSpacing: 0,
                  },
                ]}
              >
                Your groups
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, selectedTab]);

  return (
    <View style={globalStyles.container}>
      {forYouScreen ? (
        <ScrollView ref={scrollViewRef}>
          <View
            style={{
              height: screenHeight * 0.33,
              opacity: onboardingState == 3 || onboardingState == 6 ? 1 : 1,
              backgroundColor:
                (performOnboarding == true && onboardingState != 3) ||
                showFinishedPopup == true
                  ? "#BBBBBB"
                  : "#fdfdfd",
            }}
          >
            <HomeScreenTasks />
          </View>
          <View style={{ height: 5, backgroundColor: "lightgray" }}></View>
          <View
            style={{
              height: screenHeight * 0.33,
              opacity: onboardingState == 4 || onboardingState == 6 ? 1 : 1,
              backgroundColor:
                (performOnboarding == true && onboardingState != 4) ||
                showFinishedPopup == true
                  ? "#BBBBBB"
                  : "#fdfdfd",
            }}
          >
            <HomeScreenLeaderboard />
          </View>
          <View
            style={{
              height: screenHeight * 0.33,
              opacity: onboardingState == 5 || onboardingState == 6 ? 1 : 1,
              backgroundColor:
                (performOnboarding == true && onboardingState != 5) ||
                showFinishedPopup == true
                  ? "#BBBBBB"
                  : "#fdfdfd",
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
              shadowColor: "#111111",
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
              style={{ height: screenHeight * 0.32, width: screenWidth * 0.7 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  height: "20%",
                  width: "100%",
                  justifyContent: "flex-end",
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
                  color: "#111111",
                  textAlign: "center",
                  fontSize: 18,
                  fontFamily: "Poppins_600SemiBold",
                  textAlign: "center",
                  paddingHorizontal: 8,
                  paddingBottom: 8,
                }}
              >
                {titleMessage[onboardingState]}
              </Text>
              <View
                style={{
                  alignSelf: "center",
                  paddingHorizontal: 8,
                  paddingBottom: onboardingState != 4 ? 24 : 6,
                }}
              >
                <Text style={globalStyles.bodyRegular}>
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
                    if (onboardingState == 4) {
                      scrollToBottom();
                    }
                    if (onboardingState == 5) {
                      setPerformOnboarding(false);
                      setShowFinishedPopup(true);
                      setOnboardingState(onboardingState + 1);
                    } else {
                      setOnboardingState(onboardingState + 1);
                    }
                  }}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    {onboardingState < 5 ? "Next" : "Done"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {onboardingState != 3 && (
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
                color: "#111111",
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
                color: "#111111",
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
