import "react-native-gesture-handler";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigationState } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";

import { Image, Platform, StyleSheet, View, Text } from "react-native";
import { useAssets } from "expo-asset";

import { useContext } from "react";
import { AccountContext } from "./AccountContext";

import LoginScreen from "./Login/LoginScreen";
import SignUpScreen from "./Login/SignUpScreen";
import CodeVerificationScreen from "./Login/CodeVerificationScreen";

import HomeScreen from "./HomeScreen/HomeScreen";
import MyGroupsScreen from "./Groups/MyGroups";
import CreateTask from "./Groups/CreateTask";
import MyGroupTasks from "./Groups/MyGroupTasks";

import SplashScreen from "./SplashScreens/SplashScreen";
import LandingPage from "./LandingPage";
import FreebieLandingPage from "./FreebieLandingPage";
import HandleInviteScreen from "./HandleInvite";
import LtiLoginScreen from "./LtiLoginScreen";

import SettingsScreen from "./UserSettings/SettingsScreen";
import DeleteAccountScreen from "./UserSettings/DeleteAccount";
import ChangeUsernameScreen from "./UserSettings/ChangeUsername";
import ChangePasswordScreen from "./UserSettings/ChangePassword";
import ForgotPasswordScreen from "./UserSettings/ForgotPassword";
import ForgotPasswordLoggedOut from "./UserSettings/ForgotPasswordLoggedOut";
import HelpScreen from "./Onboarding/HelpPage";
import AccountScreen from "./UserSettings/AccountScreen";
import FeedbackScreen from "./UserSettings/FeedbackScreen";
import NotificationSettings from "./UserSettings/NotificationSettings";
import StudyModeScreen from "./UserSettings/StudyModeScreen";

import AddGroupScreen from "./Groups/AddGroup";
import NotificationsScreen from "./Notifications/Notifications";

import CreateGroupScreen from "./Groups/CreateGroupScreen";
import EditGroupScreen from "./Groups/EditGroupScreen";
import GroupListScreen from "./Groups/GroupListScreen";
import ChatScreen from "./Chat/ChatScreen";
import PostScreen from "./Chat/PostScreen";
import CreatePostScreen from "./Chat/CreatePost";
import EditPostScreen from "./Chat/EditPost";
import ViewPostScreen from "./Chat/ViewPostScreen";
import GroupInfoScreen from "./Chat/GroupInfoScreen";
import GroupAnalytics from "./Chat/GroupAnalytics";
import DeleteGroupScreen from "./Groups/DeleteGroupScreen";
import JoinGroupWithPasscode from "./Groups/JoinGroupWithPasscode";
import GroupAchievements from "./Chat/GroupAchievements";
import GroupLeaderboard from "./Chat/GroupLeaderboard";

import LearnMore1Screen from "./Onboarding/LearnMore1";
import LearnMore2Screen from "./Onboarding/LearnMore2";
import LearnMore4Screen from "./Onboarding/LearnMore4";
import LearnMore7Screen from "./Onboarding/LearnMore7";
import PrivacyScreen from "./Onboarding/Privacy";
import TermsScreen from "./Onboarding/Terms";

import ProfilePageScreen from "./UserSettings/ProfilePage";
import OverallAchievements from "./UserSettings/OverallAchievements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as SplashScreenExpo from "expo-splash-screen";
import TooltipLabel from "./TooltipLabel";

import CertificatesScreen from "./Certificates/CertificatesScreen";

const HomeDrawer = createDrawerNavigator();

function HomeDrawerNavigator() {
  return (
    <HomeDrawer.Navigator
      backBehavior="history"
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#2482AA",
        },
        headerTintColor: "#fbfbfb",
      }}
    >
      {/* <HomeDrawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          animation: "none",
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="gauge-high"
                solid
                style={{
                  color: "#292929", // Default color, adjust if needed
                }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                Progress
              </Text>
            </View>
          ),
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
      /> */}
      <HomeDrawer.Screen
        name="Certificates"
        component={CertificatesScreen}
        options={{
          animation: "none",
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="medal"
                solid
                style={{
                  color: "#292929", // Default color, adjust if needed
                }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                My Awards
              </Text>
            </View>
          ),
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
      />
      <HomeDrawer.Screen
        name="MyGroups"
        component={MyGroupsScreen}
        options={{
          animation: "none",
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="user-group"
                solid
                style={{
                  color: "#292929", // Default color, adjust if needed
                }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                My Groups
              </Text>
            </View>
          ),
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
      />

      <HomeDrawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />

      <HomeDrawer.Screen
        name="ViewAllGroups"
        component={GroupListScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="Group Tabs"
        component={GroupTabs}
        options={{ drawerItemStyle: { display: "none" } }}
      />

      <HomeDrawer.Screen
        name="AddGroup"
        component={AddGroupScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="CreateTask"
        component={CreateTask}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="MyGroupTasks"
        component={MyGroupTasks}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="OverallAchievements"
        component={OverallAchievements}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="GroupAchievements"
        component={GroupAchievements}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="EditGroup"
        component={EditGroupScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="Group Chat"
        component={ChatScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="PostScreen"
        component={PostScreen}
        options={{ animation: "none", drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="EditPost"
        component={EditPostScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="ViewPost"
        component={ViewPostScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="GroupInfo"
        component={GroupInfoScreen}
        options={{ animation: "none", drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="GroupAnalytics"
        component={GroupAnalytics}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="DeleteGroup"
        component={DeleteGroupScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="JoinGroup"
        component={JoinGroupWithPasscode}
        options={{ drawerItemStyle: { display: "none" } }}
      />

      <HomeDrawer.Screen
        name="ProfilePage"
        component={ProfilePageScreen}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="circle-user"
                solid
                style={{
                  color: "#292929",
                }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                My Profile
              </Text>
            </View>
          ),
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
          headerTitle: "Profile", // Use a simple title for the header
        }}
      />

      <HomeDrawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="bell"
                solid
                style={{
                  color: "#292929", // Default color, adjust if needed
                }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                Notifications
              </Text>
            </View>
          ),
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
      />
      <HomeDrawer.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="ChangeUsernameScreen"
        component={ChangeUsernameScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />

      {/* <HomeDrawer.Screen
        name="HelpLoggedIn"
        component={HelpScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      /> */}

      <HomeDrawer.Screen
        name="HelpLoggedIn"
        component={HelpScreen}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="circle-question"
                solid
                style={{
                  color: "#292929",
                }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                Nuubi FAQ
              </Text>
            </View>
          ),
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
          headerTitle: "Profile", // Use a simple title for the header
        }}
      />

      <HomeDrawer.Screen
        name="FeedbackScreen"
        component={FeedbackScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="NotificationSettings"
        component={NotificationSettings}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="StudyModeScreen"
        component={StudyModeScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
    </HomeDrawer.Navigator>
  );
}

const StackWeb = createNativeStackNavigator();

function WebStack() {
  const initialRoute = "Home Page";
  return (
    <StackWeb.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <StackWeb.Screen name="Home Page" component={HomeDrawerNavigator} />
    </StackWeb.Navigator>
  );
}

const CanvasDrawer = createDrawerNavigator();

function CanvasDrawerNavigator() {
  return (
    <CanvasDrawer.Navigator
      initialRouteName="LtiLogin"
      backBehavior="history"
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#2482AA",
        },
        headerTintColor: "#fbfbfb",
      }}
    >
      <CanvasDrawer.Screen
        name="LtiLogin"
        component={LtiLoginScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />

      <CanvasDrawer.Screen
        name="Certificates"
        component={CertificatesScreen}
        options={{
          animation: "none",
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="medal"
                solid
                style={{ color: "#292929" }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                My Awards
              </Text>
            </View>
          ),
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
      />

      <CanvasDrawer.Screen
        name="MyGroups"
        component={MyGroupsScreen}
        options={{
          animation: "none",
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="user-group"
                solid
                style={{ color: "#292929" }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                My Groups
              </Text>
            </View>
          ),
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
      />

      {/* Hidden Screens */}
      <CanvasDrawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="ViewAllGroups"
        component={GroupListScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="Group Tabs"
        component={GroupTabs}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="AddGroup"
        component={AddGroupScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="CreateTask"
        component={CreateTask}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="MyGroupTasks"
        component={MyGroupTasks}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="OverallAchievements"
        component={OverallAchievements}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="GroupAchievements"
        component={GroupAchievements}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="EditGroup"
        component={EditGroupScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="Group Chat"
        component={ChatScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="PostScreen"
        component={PostScreen}
        options={{ animation: "none", drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="EditPost"
        component={EditPostScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="ViewPost"
        component={ViewPostScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="GroupInfo"
        component={GroupInfoScreen}
        options={{ animation: "none", drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="GroupAnalytics"
        component={GroupAnalytics}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="DeleteGroup"
        component={DeleteGroupScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="JoinGroup"
        component={JoinGroupWithPasscode}
        options={{ drawerItemStyle: { display: "none" } }}
      />

      <CanvasDrawer.Screen
        name="ProfilePage"
        component={ProfilePageScreen}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="circle-user"
                solid
                style={{ color: "#292929" }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                My Profile
              </Text>
            </View>
          ),
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
          headerTitle: "Profile",
        }}
      />

      <CanvasDrawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="bell"
                solid
                style={{ color: "#292929" }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                Notifications
              </Text>
            </View>
          ),
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
      />

      <CanvasDrawer.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="ChangeUsernameScreen"
        component={ChangeUsernameScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />

      <CanvasDrawer.Screen
        name="HelpLoggedIn"
        component={HelpScreen}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="circle-question"
                solid
                style={{ color: "#292929" }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                Nuubi FAQ
              </Text>
            </View>
          ),
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
          headerTitle: "Profile",
        }}
      />

      <CanvasDrawer.Screen
        name="FeedbackScreen"
        component={FeedbackScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="NotificationSettings"
        component={NotificationSettings}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <CanvasDrawer.Screen
        name="StudyModeScreen"
        component={StudyModeScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
    </CanvasDrawer.Navigator>
  );
}

const GroupTab = createMaterialTopTabNavigator();

function GroupTabs({ navigation, route }) {
  const { groupName = "Group" } = route.params || {};
  React.useEffect(() => {
    if (groupName) {
      navigation.setOptions({ title: groupName });
    }
  }, [groupName, navigation]);

  const { currentPost = 1 } = route.params || {};

  React.useEffect(() => {
    if (currentPost) {
      navigation.setOptions({ currentPost: 1 });
    }
  }, [currentPost, navigation]);

  return (
    <GroupTab.Navigator
      screenOptions={{
        tabBarItemStyle: { pointerEvents: "auto" },
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: "Poppins_500Medium",
          color: "#050505",
        },
        tabBarStyle: {
          backgroundColor: "#fbfbfb",
        },
        tabBarIndicatorStyle: { backgroundColor: "#33B7F0", height: 2 },
      }}
    >
      <GroupTab.Screen name="Threads" component={PostScreen} />

      <GroupTab.Screen name="Chat" component={ChatScreen} />
      <GroupTab.Screen name="Leaders" component={GroupLeaderboard} />
      <GroupTab.Screen name="More" component={GroupInfoScreen} />

      {/* add settings and leaderboard pages here when created */}
    </GroupTab.Navigator>
  );
}

const StackSettings = createNativeStackNavigator();

function SettingsStack() {
  return (
    <StackSettings.Navigator
      initialRouteName="ProfilePage"
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#2482AA",
        },
        headerTintColor: "#fbfbfb",
      }}
      // screenOptions={{ headerShown: false }}
    >
      <StackSettings.Screen name="ProfilePage" component={ProfilePageScreen} />
      <StackSettings.Screen
        name="OverallAchievements"
        component={OverallAchievements}
      />

      <StackSettings.Screen name="Settings" component={SettingsScreen} />

      <StackSettings.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <StackSettings.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <StackSettings.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
      />
      <StackSettings.Screen
        name="ChangeUsernameScreen"
        component={ChangeUsernameScreen}
      />
      <StackSettings.Screen name="AccountScreen" component={AccountScreen} />
      <StackSettings.Screen name="FeedbackScreen" component={FeedbackScreen} />
      <StackSettings.Screen
        name="NotificationSettings"
        component={NotificationSettings}
      />
      <StackSettings.Screen
        name="StudyModeScreen"
        component={StudyModeScreen}
      />
      <StackSettings.Screen
        name="HelpLoggedIn"
        component={HelpScreen}
        options={{ title: "Nuubi How-To" }}
      />
    </StackSettings.Navigator>
  );
}

const StackHome = createNativeStackNavigator();

function HomeStack() {
  return (
    <StackHome.Navigator
      initialRouteName="Certificates"
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#2482AA",
        },
        headerTintColor: "#fbfbfb",
      }}
    >
      <StackHome.Screen
        name="Certificates"
        component={CertificatesScreen}
        // options={{ animation: "none" }}
        options={{
          animation: "none",
          headerStyle: {
            backgroundColor: "#2482AA",
          },
        }}
        //    options={{ title: "Home" }}
      />
      <StackHome.Screen
        name="Home"
        component={HomeScreen}
        // options={{ animation: "none" }}
        options={{
          animation: "none",
          headerStyle: {
            backgroundColor: "#2482AA",
          },
        }}
        //    options={{ title: "Home" }}
      />
      <StackHome.Screen
        name="MyGroups"
        component={MyGroupsScreen}
        options={{
          animation: "none",
          headerStyle: {
            backgroundColor: "#2482AA",
          },
        }}
        //    options={{ title: "My Groups" }}
      />

      <StackHome.Screen name="EditGroup" component={EditGroupScreen} />
      <StackHome.Screen name="Group Chat" component={ChatScreen} />
      <StackHome.Screen
        name="PostScreen"
        component={PostScreen}
        options={{ animation: "none" }}
      />
      <StackHome.Screen name="CreatePost" component={CreatePostScreen} />
      <StackHome.Screen name="CreateTask" component={CreateTask} />
      <StackHome.Screen name="MyGroupTasks" component={MyGroupTasks} />
      <StackHome.Screen name="EditPost" component={EditPostScreen} />
      <StackHome.Screen name="ViewPost" component={ViewPostScreen} />
      <StackHome.Screen
        name="GroupInfo"
        component={GroupInfoScreen}
        options={{ animation: "none" }}
      />
      <StackHome.Screen
        name="GroupAchievements"
        component={GroupAchievements}
      />
      <StackHome.Screen
        name="GroupAnalytics"
        component={GroupAnalytics}
        //   options={{ animation: "none" }}
      />
      <StackHome.Screen name="DeleteGroup" component={DeleteGroupScreen} />
      <StackHome.Screen
        name="HelpLoggedIn"
        component={HelpScreen}
        options={{ title: "Nuubi How-To" }}
      />
      <StackHome.Screen name="JoinGroup" component={JoinGroupWithPasscode} />
    </StackHome.Navigator>
  );
}

const StackSearch = createNativeStackNavigator();

function SearchStack() {
  return (
    <StackSearch.Navigator
      initialRouteName="ViewAllGroups"
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#2482AA",
        },
        headerTintColor: "#fbfbfb",
      }}
    >
      <StackSearch.Screen name="ViewAllGroups" component={GroupListScreen} />
      <StackSearch.Screen name="EditGroup" component={EditGroupScreen} />
      <StackSearch.Screen name="Group Chat" component={ChatScreen} />
      <StackSearch.Screen name="PostScreen" component={PostScreen} />
      <StackSearch.Screen name="CreatePost" component={CreatePostScreen} />
      <StackSearch.Screen name="CreateTask" component={CreateTask} />
      <StackSearch.Screen name="MyGroupTasks" component={MyGroupTasks} />
      <StackSearch.Screen name="EditPost" component={EditPostScreen} />
      <StackSearch.Screen name="ViewPost" component={ViewPostScreen} />
      <StackSearch.Screen name="GroupInfo" component={GroupInfoScreen} />
      <StackSearch.Screen
        name="GroupAchievements"
        component={GroupAchievements}
      />
      <StackSearch.Screen
        name="GroupAnalytics"
        component={GroupAnalytics}
        //   options={{ animation: "none" }}
      />
      <StackSearch.Screen name="DeleteGroup" component={DeleteGroupScreen} />
      <StackSearch.Screen name="JoinGroup" component={JoinGroupWithPasscode} />
    </StackSearch.Navigator>
  );
}

const StackAuth = createNativeStackNavigator();

function AuthStack() {
  return (
    <StackAuth.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#2482AA",
        },
        headerTintColor: "#fbfbfb",
      }}
    >
      <StackAuth.Screen
        name="Welcome"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <StackAuth.Screen name="Login" component={LoginScreen} />
      <StackAuth.Screen name="SignUp" component={SignUpScreen} />
      <StackAuth.Screen
        name="ForgotPasswordLoggedOut"
        component={ForgotPasswordLoggedOut}
      />
      <StackAuth.Screen
        name="CodeVerificationScreen"
        component={CodeVerificationScreen}
      />
      <StackAuth.Screen name="LandingPage" component={LandingPage} />
      <StackAuth.Screen
        name="FreebieLandingPage"
        component={FreebieLandingPage}
      />
      <StackAuth.Screen name="LearnMore1" component={LearnMore1Screen} />
      <StackAuth.Screen name="LearnMore2" component={LearnMore2Screen} />
      <StackAuth.Screen name="LearnMore4" component={LearnMore4Screen} />
      <StackAuth.Screen name="LearnMore7" component={LearnMore7Screen} />
      <StackAuth.Screen name="PrivacyScreen" component={PrivacyScreen} />
      <StackAuth.Screen name="TermsScreen" component={TermsScreen} />
      <StackAuth.Screen name="FeedbackScreen" component={FeedbackScreen} />
      <StackAuth.Screen
        name="HelpLoggedOut"
        component={HelpScreen}
        options={{ title: "Nuubi How-To" }}
      />
    </StackAuth.Navigator>
  );
}
const StackLanding = createNativeStackNavigator();
// Landing Stack (Directly accessable)
function LandingStack() {
  return (
    <StackLanding.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#2482AA",
        },
        headerTintColor: "#fbfbfb",
      }}
    >
      <StackLanding.Screen name="Free Guide" component={FreebieLandingPage} />
      <StackLanding.Screen name="Landing Page" component={LandingPage} />
      <StackLanding.Screen name="SplashScreen" component={SplashScreen} />
      {/* Other landing-related screens */}
    </StackLanding.Navigator>
  );
}

const StackAddGroup = createNativeStackNavigator();

function AddGroupStack() {
  return (
    <StackAddGroup.Navigator
      initialRouteName="AddGroup"
      screenOptions={{ headerBackTitleVisible: false }}
    >
      <StackAddGroup.Screen name="AddGroup" component={AddGroupScreen} />
      <StackAddGroup.Screen
        name="JoinGroup"
        component={JoinGroupWithPasscode}
      />
      <StackAddGroup.Screen name="CreateGroup" component={CreateGroupScreen} />
      <StackAddGroup.Screen name="CreateTask" component={CreateTask} />
      <StackAddGroup.Screen name="MyGroupTasks" component={MyGroupTasks} />
    </StackAddGroup.Navigator>
  );
}

const StackMyGroups = createNativeStackNavigator();

function MyGroupsStack() {
  return (
    <StackMyGroups.Navigator
      initialRouteName="MyGroups"
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#2482AA",
          tabBarLabelStyle: { fontSize: 12, fontFamily: "Poppins_500Medium" },
        },
        headerTintColor: "#fbfbfb",
      }}
    >
      <StackMyGroups.Screen
        name="MyGroups"
        component={MyGroupsScreen}
        options={{
          animation: "none",
          headerStyle: {
            backgroundColor: "#2482AA",
          },
        }}
      />

      <StackMyGroups.Screen name="EditGroup" component={EditGroupScreen} />
      <StackMyGroups.Screen name="Group Tabs" component={GroupTabs} />
      <StackMyGroups.Screen
        name="PostScreen"
        component={PostScreen}
        options={{ animation: "none" }}
      />
      <StackMyGroups.Screen name="CreatePost" component={CreatePostScreen} />
      <StackMyGroups.Screen name="CreateTask" component={CreateTask} />
      <StackMyGroups.Screen name="MyGroupTasks" component={MyGroupTasks} />
      <StackMyGroups.Screen name="EditPost" component={EditPostScreen} />
      <StackMyGroups.Screen name="ViewPost" component={ViewPostScreen} />
      <StackMyGroups.Screen
        name="GroupInfo"
        component={GroupInfoScreen}
        options={{ animation: "none" }}
      />
      <StackMyGroups.Screen
        name="GroupAchievements"
        component={GroupAchievements}
      />
      <StackMyGroups.Screen
        name="GroupAnalytics"
        component={GroupAnalytics}
        //   options={{ animation: "none" }}
      />
      <StackMyGroups.Screen name="DeleteGroup" component={DeleteGroupScreen} />
      <StackMyGroups.Screen
        name="HelpLoggedIn"
        component={HelpScreen}
        options={{ title: "Nuubi How-To" }}
      />
      <StackMyGroups.Screen
        name="JoinGroup"
        component={JoinGroupWithPasscode}
      />
      <StackMyGroups.Screen name="AddGroup" component={AddGroupScreen} />
      <StackMyGroups.Screen name="CreateGroup" component={CreateGroupScreen} />
      <StackMyGroups.Screen name="ViewAllGroups" component={GroupListScreen} />
    </StackMyGroups.Navigator>
  );
}

const StackHandleInvite = createDrawerNavigator();

function HandleInviteNavigator() {
  return (
    <StackHandleInvite.Navigator
      initialRouteName="HandleInvite"
      backBehavior="history"
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#2482AA",
        },
        headerTintColor: "#fbfbfb",
      }}
    >
      {/* Screen for handling invite links */}
      <StackHandleInvite.Screen
        name="HandleInvite"
        component={HandleInviteScreen}
        // options={{ title: "Handle Invite" }}
        options={{
          title: "Handle Invite",
          drawerItemStyle: { display: "none" }, // Ensure this doesn't show in the drawer
        }}
      />

      {/* All other screens */}
      {/* <StackHandleInvite.Screen
        name="Home"
        component={HomeScreen}
        options={{
          animation: "none",
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="gauge-high"
                solid
                style={{
                  color: "#292929", // Default color, adjust if needed
                }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                Progress
              </Text>
            </View>
          ),
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
      /> */}
      <HomeDrawer.Screen
        name="Certificates"
        component={CertificatesScreen}
        options={{
          animation: "none",
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="medal"
                solid
                style={{
                  color: "#292929", // Default color, adjust if needed
                }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                My Awards
              </Text>
            </View>
          ),
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
      />
      <StackHandleInvite.Screen
        name="MyGroups"
        component={MyGroupsScreen}
        options={{
          animation: "none",
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="user-group"
                solid
                style={{ color: "#292929" }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                Groups
              </Text>
            </View>
          ),
          drawerLabelStyle: { fontFamily: "Poppins_500Medium" },
          drawerActiveTintColor: "#2482AA",
        }}
      />
      <StackHandleInvite.Screen
        name="Home"
        component={HomeScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="ViewAllGroups"
        component={GroupListScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="Group Tabs"
        component={GroupTabs}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="AddGroup"
        component={AddGroupScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="CreateTask"
        component={CreateTask}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="MyGroupTasks"
        component={MyGroupTasks}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="OverallAchievements"
        component={OverallAchievements}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="GroupAchievements"
        component={GroupAchievements}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="EditGroup"
        component={EditGroupScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="Group Chat"
        component={ChatScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="PostScreen"
        component={PostScreen}
        options={{ animation: "none", drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="EditPost"
        component={EditPostScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="ViewPost"
        component={ViewPostScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="GroupInfo"
        component={GroupInfoScreen}
        options={{ animation: "none", drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="GroupAnalytics"
        component={GroupAnalytics}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="DeleteGroup"
        component={DeleteGroupScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="JoinGroup"
        component={JoinGroupWithPasscode}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="bell"
                solid
                style={{ color: "#292929" }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                Notifications
              </Text>
            </View>
          ),
          drawerLabelStyle: { fontFamily: "Poppins_500Medium" },
          drawerActiveTintColor: "#2482AA",
        }}
      />
      <StackHandleInvite.Screen
        name="ProfilePage"
        component={ProfilePageScreen}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="circle-user"
                solid
                style={{ color: "#292929" }}
                size={24}
              />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#292929",
                }}
              >
                Profile
              </Text>
            </View>
          ),
          drawerLabelStyle: { fontFamily: "Poppins_500Medium" },
          drawerActiveTintColor: "#2482AA",
          headerTitle: "Profile",
        }}
      />
      <StackHandleInvite.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="ChangeUsernameScreen"
        component={ChangeUsernameScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="HelpLoggedIn"
        component={HelpScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="FeedbackScreen"
        component={FeedbackScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="NotificationSettings"
        component={NotificationSettings}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="StudyModeScreen"
        component={StudyModeScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="Welcome"
        component={SplashScreen}
        options={{ drawerItemStyle: { display: "none" }, headerShown: false }}
      />
      <StackHandleInvite.Screen
        name="Login"
        component={LoginScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="ForgotPasswordLoggedOut"
        component={ForgotPasswordLoggedOut}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="CodeVerificationScreen"
        component={CodeVerificationScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="LandingPage"
        component={LandingPage}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="FreebieLandingPage"
        component={FreebieLandingPage}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="LearnMore1"
        component={LearnMore1Screen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="LearnMore2"
        component={LearnMore2Screen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="LearnMore4"
        component={LearnMore4Screen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="LearnMore7"
        component={LearnMore7Screen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="PrivacyScreen"
        component={PrivacyScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <StackHandleInvite.Screen
        name="TermsScreen"
        component={TermsScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />

      <StackHandleInvite.Screen
        name="HelpLoggedOut"
        component={HelpScreen}
        options={{
          title: "Nuubi How-To",
          drawerItemStyle: { display: "none" },
        }}
      />
    </StackHandleInvite.Navigator>
  );
}

const StackNotifications = createNativeStackNavigator();

function NotificationsStack() {
  return (
    <StackNotifications.Navigator
      initialRouteName="Notifications"
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#2482AA",
        },
        headerTintColor: "#fbfbfb",
      }}
    >
      <StackNotifications.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
    </StackNotifications.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [notifications, setNotifications] = React.useState(false);
  const { user, setUser } = React.useContext(AccountContext);
  const { isLoggedIn, setIsLoggedIn } = React.useContext(AccountContext);
  // const [avatarInfo, setAvatarInfo] = React.useState(null);

  // getLoginStatus and user data when the app loads
  const getLoginStatus = async () => {
    try {
      const data = await AsyncStorage.getItem("isLoggedIn");
      setIsLoggedIn(data === "true");
    } catch (error) {
      console.error("Error retrieving login status from Async Storage", error);
      setIsLoggedIn(false);
    }
  };

  // Checking if the user is successfully retrieved from SecureStore, if not then there is no user or not able to fetch the user. If get we parse it and then set the parsed data to the user variable
  const getUser = async () => {
    try {
      const userData = await SecureStore.getItemAsync("user");

      if (!userData) {
        setUser({ token: null });
        return null;
      }
      const user = JSON.parse(userData);
      setUser(user);
    } catch (error) {
      console.error("Error retrieving user from SecureStore", error);
    }
  };

  React.useEffect(() => {
    getLoginStatus();
    if (!user || user.token === null || user.token === undefined) {
      getUser();
    }

    setTimeout(() => {
      SplashScreenExpo.hideAsync();
    }, 900);
  }, []);

  const getNotifications = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:8080/groups/getnotificationsunread",
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
      setNotifications(jsonData.hasUnreadNotifications);
    } catch (err) {
      console.error(err.message);
    }
  };

  // const getUserAvatar = async () => {
  //   const token =
  //     Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : null; // Get token only on mobile

  //   try {
  //     const response = await fetch(
  //       "http://localhost:8080/settings/getuseravatar",
  //       {
  //         method: "POST",
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //           ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //         },
  //         body: JSON.stringify({ ...user }),
  //       }
  //     );
  //     const jsonData = await response.json();
  //     setAvatarInfo(jsonData.avatar_url.avatar_url);
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };

  React.useEffect(() => {
    getNotifications();
    //  getUserAvatar();
  }, [user]);

  let assets1 = useAssets([require("../assets/icons/HomeFocused.png")]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabel: ({ focused, color }) => {
          let label;
          switch (route.name) {
            case "HomeStack":
              label = "Awards";
              break;
            // case "SearchStack":
            //   label = "Discover";
            //   break;
            case "MyGroupsStack":
              label = "Groups";
              break;
            case "SettingsStack":
              label = "Profile";
              break;
            case "NotificationsStack":
              label = "Notifications";
              break;
            default:
              label = route.name;
              break;
          }
          return <Text>{label}</Text>;
        },
        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case "HomeStack":
              return (
                <FontAwesome6
                  // name="gauge-high"
                  name="medal"
                  style={{
                    color: focused ? "#2482AA" : "#767676",
                  }}
                  size={24}
                />
              );
            // case "SearchStack":
            //   return (
            //     <FontAwesome6
            //       name="magnifying-glass"
            //       style={{
            //         color: focused ? "#2482AA" : "#767676",
            //       }}
            //       size={24}
            //     />
            //   );
            case "MyGroupsStack":
              return (
                <FontAwesome6
                  name="user-group"
                  style={{
                    color: focused ? "#2482AA" : "#767676",
                  }}
                  size={24}
                />
              );
            case "NotificationsStack":
              return (
                <View style={styles.iconContainer}>
                  <FontAwesome6
                    name="bell"
                    solid
                    style={{
                      color: focused ? "#2482AA" : "#767676",
                    }}
                    size={24}
                  />
                  {notifications && <View style={styles.redDot} />}
                </View>
              );
            case "SettingsStack":
              return (
                // avatarInfo ? (
                //   <View
                //     style={[
                //       styles.avatarContainer,
                //       focused && styles.avatarContainerFocused,
                //     ]}
                //   >
                //     <Image source={{ uri: avatarInfo }} style={styles.avatar} />
                //   </View>
                // ) :

                <FontAwesome6
                  name="circle-user"
                  solid
                  style={{
                    color: focused ? "#2482AA" : "#767676",
                  }}
                  size={24}
                />
              );
            default:
              const ImageSource =
                Platform.OS == "web"
                  ? require("../assets/icons/HomeFocused.png")
                  : assets1[0];
          }
          return (
            <FontAwesome6
              name="house"
              style={{
                color: "#2482AA",
              }}
              size={24}
            />
          );
        },
        tabBarInactiveTintColor: "#767676",
        tabBarActiveTintColor: "#2482AA",
        tabBarLabelStyle: {
          fontFamily: "Poppins_500Medium",
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ tabBarLabel: "Awards" }}
      />
      {/* <Tab.Screen
        name="SearchStack"
        component={SearchStack}
        options={{ tabBarLabel: "Discover" }}
      /> */}
      <Tab.Screen
        name="MyGroupsStack"
        component={MyGroupsStack}
        options={{ tabBarLabel: "Groups" }}
      />

      <Tab.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{ tabBarLabel: "Profile" }}
      />
      <Tab.Screen
        name="NotificationsStack"
        component={NotificationsStack}
        options={{ tabBarLabel: "Notifications" }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

export default function Views({ landingPage, inviteToken }) {
  const { user, setUser, isLoggedIn, setIsLoggedIn } =
    useContext(AccountContext);
  //const [isLoggedIn, setIsLoggedIn] = React.useState(false);

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
      const response = await fetch(
        `http://localhost:8080/auth/checkweblogin`,
        //  `http://localhost:8080/auth/checkweblogin`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.isLoggedIn == true) {
        // Backend confirms the user is logged in, return true
        return true;
      } else {
        // Backend confirms the user is not logged in, check sessionStorage
        const token = user.token || sessionStorage.getItem("token");

        if (token) {
          // If a token is found in sessionStorage, consider the user logged in
          return true;
        }

        // If no token is found in sessionStorage, return false
        return false;
      }

      // return data.isLoggedIn; // Assuming the backend returns { isLoggedIn: true/false }
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

  // 1️⃣ Check login status on mount
  React.useEffect(() => {
    if (!landingPage && !inviteToken) {
      const checkLoginStatus = async () => {
        try {
          const loggedIn = await checkIsLoggedIn();
          setIsLoggedIn(Boolean(loggedIn));
        } catch (error) {
          console.error("Error checking login status:", error);
          setIsLoggedIn(false);
        }
      };

      checkLoginStatus();
    }
  }, [landingPage, inviteToken]); // ✅ Runs on mount or when inviteToken changes

  // 2️⃣ Check login status again when `user` changes
  React.useEffect(() => {
    if (user?.token) {
      const verifyLogin = async () => {
        const loggedIn = await checkIsLoggedIn();
        setIsLoggedIn(Boolean(loggedIn)); // ✅ Only update if `checkIsLoggedIn` confirms it
      };

      verifyLogin();
    }
  }, [user]); // ✅ Runs only when `user` changes

  // React.useEffect(() => {
  //   if (!landingPage && !inviteToken) {
  //     // Only run if landingPage is false
  //     const checkLoginStatus = async () => {
  //       const loggedIn = await checkIsLoggedIn(); // Call the async login check
  //       console.log(Boolean(loggedIn));
  //       setIsLoggedIn(Boolean(loggedIn));
  //     };

  //     checkLoginStatus(); // Run the check when the component mounts
  //   }
  // }, [landingPage, user]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {inviteToken && inviteToken !== "undefined" ? (
        <Stack.Screen
          name="HandleInviteNavigator"
          component={HandleInviteNavigator}
          initialParams={{ inviteToken: inviteToken }}
        />
      ) : landingPage ? (
        <Stack.Screen name="FreebieLandingPage" component={LandingStack} />
      ) : isLoggedIn ? (
        // If logged in, show either web or mobile homepage
        Platform.OS === "web" ? (
          <Stack.Screen name="DrawerTabs" component={WebStack} />
        ) : (
          <Stack.Screen name="BottomTabs" component={TabNavigator} />
        )
      ) : (
        // If not logged in, show SignIn page
        <Stack.Screen
          name="Signin"
          component={AuthStack}
          options={{ title: "Log in" }}
        />
      )}
      <Stack.Screen
        name="Canvas"
        component={CanvasDrawerNavigator}
        options={{ path: "lti-login" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: "relative",
    width: 24,
    height: 24,
  },
  redDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    overflow: "hidden",
  },
  avatarContainerFocused: {
    borderColor: "#2482AA",
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
    padding: 1,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
