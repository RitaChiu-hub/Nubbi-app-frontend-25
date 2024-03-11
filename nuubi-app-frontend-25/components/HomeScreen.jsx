import * as React from "react";
import {
  Text,
  View,
  Modal,
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { AccountContext } from "./AccountContext";
import socket from "../socket";
import { globalStyles } from "../styles/global";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/FontAwesome";
import { Entypo } from "@expo/vector-icons";
// import HomeScreenNavBar from "./HomeScreen/HomeScreenNavBar";
import HomeScreenTasks from "./HomeScreen/HomeScreenTasks";
import HomeScreenLeaderboard from "./HomeScreen/HomeScreenLeaderboard";
import HomeScreenBadges from "./HomeScreen/HomeScreenBadges";
import { Overlay } from "react-native-elements";
import { useState, useRef } from "react";
import AwesomeAlert from "react-native-awesome-alerts";

export default function HomeScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [forYouScreen, setForYouScreen] = React.useState(true);
  const [selectedTab, setSelectedTab] = React.useState("Home");
  const [myUsername, setMyUsername] = React.useState("");

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

  const [performOnboarding, setPerformOnboarding] = React.useState(true);
  const [onboardingState, setOnboardingState] = React.useState(0);
  const [showFinishedPopup, setShowFinishedPopup] = React.useState(false);
  const positionBottom = [0.1, 0.1, 0.1, 0.25, 0.56, 0.41];
  const positionLeft = [0.02, 0.25, 0.26, 0.2, 0.1, 0.05];
  const arrowPositionLeft = [0.05, 0.22, 0.61, 0.4, 0.15, 0.1];
  const cardIcon = [
    "price-ribbon",
    "price-ribbon",
    "price-ribbon",
    "price-ribbon",
    "price-ribbon",
    "price-ribbon",
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
    "Tap the plus icon to add or join a group; Or create a new post",
    "Update your profile, username, notifications, and more here",
    "Get rewarded by asking questions, chattings, and learning with peers. Swipe to see all your daily tasks.",
    "Every group has a leaderboard. Swipe to view each groups stats. Increase your chances at leading, the more points you earn.",
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
    <View style={styles.container}>
      {forYouScreen ? (
        <ScrollView style={styles.sections} ref={scrollViewRef}>
          <View
            style={
              {
                //  height: screenHeight * 0.33,
                // opacity: onboardingState == 3 || onboardingState == 6 ? 1 : 1,
                // backgroundColor:
                //   onboardingState == 3 || onboardingState == 6
                //     ? "white"
                //     : "#BBBBBB",
              }
            }
          >
            <HomeScreenTasks />
          </View>
          <View style={{ height: 5, backgroundColor: "lightgray" }}></View>
          <View
          // style={{
          //   height: screenHeight * 0.33,
          //   opacity: onboardingState == 4 || onboardingState == 6 ? 1 : 1,
          //   backgroundColor:
          //     onboardingState == 4 || onboardingState == 6
          //       ? "white"
          //       : "#BBBBBB",
          // }}
          >
            <HomeScreenLeaderboard />
          </View>
          <View
          // style={{
          //   height: screenHeight * 0.33,
          //   opacity: onboardingState == 5 || onboardingState == 6 ? 1 : 1,
          //   backgroundColor:
          //     onboardingState == 5 || onboardingState == 6
          //       ? "white"
          //       : "#BBBBBB",
          // }}
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
              borderRadius: 5,
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
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "10%", height: "100%" }}></View>
                <View style={{ width: "10%", height: "100%" }}>
                  <Entypo
                    name={cardIcon[onboardingState]}
                    size={32}
                    style={{ height: "100%", textAlignVertical: "bottom" }}
                  />
                </View>
                <View style={{ width: "10%", height: "100%" }}>
                  <Entypo
                    name="cross"
                    style={{ textAlign: "center" }}
                    size={26}
                  />
                </View>
              </View>
              <View style={{ height: "20%", width: "100%" }}>
                <Text
                  style={{
                    textAlign: "center",
                    textAlignVertical: "center",
                    fontSize: 16,
                    fontWeight: "500",
                    height: "100%",
                  }}
                >
                  {titleMessage[onboardingState]}
                </Text>
              </View>
              <View
                style={{
                  height: "35%",
                  width: "85%",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontStyle: "italic",
                    fontWeight: "400",
                    textAlignVertical: "center",
                    height: "100%",
                  }}
                >
                  {secondaryMessage[onboardingState]}
                </Text>
              </View>
              <View
                style={{ height: "25%", width: "100%", flexDirection: "row" }}
              >
                <View style={{ width: "45%" }}>
                  <Text
                    style={{
                      color: "gray",
                      textAlign: "right",
                      textAlignVertical: "center",
                      height: "100%",
                      fontWeight: "600",
                    }}
                  >
                    {onboardingState + 1}/6
                  </Text>
                </View>
                <View style={{ width: "10%" }}></View>
                <TouchableOpacity
                  style={{
                    width: "40%",
                    height: "55%",
                    borderRadius: 15,
                    backgroundColor: "#6699cc",
                    alignSelf: "center",
                  }}
                  onPress={() => {
                    if (onboardingState == 4) {
                      scrollToBottom();
                    }
                    if (onboardingState == 5) {
                      setPerformOnboarding(false);
                      setShowFinishedPopup(true);
                    } else {
                      setOnboardingState(onboardingState + 1);
                    }
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "white",
                      textAlign: "center",
                      textAlignVertical: "center",
                      height: "100%",
                    }}
                  >
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

      <AwesomeAlert
        show={showFinishedPopup}
        title="You're all set!"
        titleStyle={styles.popupTitle}
        message="You are now ready to begin learning."
        messageStyle={styles.popupMessage}
        closeOnTouchOutside={true}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonTextStyle={styles.popupConfirmText}
        confirmButtonStyle={styles.popupConfirm}
        confirmButtonColor="#6699cc"
        onConfirmPressed={() => {
          setOnboardingState(false);
          setPerformOnboarding(false);
          setShowFinishedPopup(false);
        }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={user.firstSignIn === true}
        onRequestClose={() => {
          setUser({
            ...user,
            firstSignIn: false,
          });
        }}
      >
        <View style={globalStyles.centeredView}>
          <View style={globalStyles.modalView}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Welcome to Nuubi! Your username is {user.username}. To change it,
              tap the profile icon{" "}
              <Image
                source={require("../assets/icons/Profile.png")}
                style={{ width: 24, height: 24 }}
              />{" "}
              in the bottom navigation bar. Then, click "Settings", and then
              "Change Username".
            </Text>
            <View style={{ paddingVertical: 10 }}></View>
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              Questions? In "Settings", click on "Help".
            </Text>
            <View style={{ paddingVertical: 10 }}></View>
            <TouchableOpacity
              style={globalStyles.secondaryButton}
              onPress={() => {
                setUser({
                  ...user,
                  firstSignIn: false,
                });
              }}
            >
              <Text style={globalStyles.secondaryButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navbar: { flex: 0.18 },
  sections: { flex: 0.62 },
  popupMessage: { fontSize: 20, width: "80%" },
  popupTitle: {
    fontSize: 22,
    color: "black",
    fontWeight: "600",
  },
  popupConfirm: {
    width: "30%",
    borderRadius: 20,
    backgroundColor: "#2F9CB4",
  },
  popupConfirmText: {
    width: "100%",
    textAlign: "center",
  },
});
