import "react-native-gesture-handler";
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, Platform } from "react-native";
import { useAssets } from "expo-asset";

import { useContext } from "react";
import { AccountContext } from "./AccountContext";

import LoginScreen from "./Login/LoginScreen";
import SignUpScreen from "./Login/SignUpScreen";
import CodeVerificationScreen from "./Login/CodeVerificationScreen";

import HomeScreen from "./HomeScreen";
import MyGroupsScreen from "./MyGroups";
import SplashScreen from "./SplashScreen";

import SettingsScreen from "./UserSettings/SettingsScreen";
import DeleteAccountScreen from "./UserSettings/DeleteAccount";
import ChangeUsernameScreen from "./UserSettings/ChangeUsername";
import ChangePasswordScreen from "./UserSettings/ChangePassword";
import ForgotPasswordScreen from "./UserSettings/ForgotPassword";
import ForgotPasswordLoggedOut from "./UserSettings/ForgotPasswordLoggedOut";
import HelpScreen from "./Onboarding/HelpPage";
import AccountScreen from "./UserSettings/AccountScreen";
import FeedbackScreen from "./UserSettings/FeedbackScreen";

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
import DeleteGroupScreen from "./Groups/DeleteGroupScreen";
import DeleteMemberScreen from "./Groups/DeleteMemberScreen";
import JoinGroupWithPasscode from "./Groups/JoinGroupWithPasscode";

import LearnMore1Screen from "./Onboarding/LearnMore1";
import LearnMore2Screen from "./Onboarding/LearnMore2";
import LearnMore4Screen from "./Onboarding/LearnMore4";
import LearnMore7Screen from "./Onboarding/LearnMore7";
import PrivacyScreen from "./Onboarding/Privacy";
import TermsScreen from "./Onboarding/Terms";

import ProfilePageScreen from "./UserSettings/ProfilePage";

const StackSettings = createNativeStackNavigator();

function SettingsStack() {
  return (
    <StackSettings.Navigator
      initialRouteName="ProfilePage"
      screenOptions={{ headerBackTitleVisible: false }}
      // screenOptions={{ headerShown: false }}
    >
      <StackSettings.Screen name="ProfilePage" component={ProfilePageScreen} />

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
      initialRouteName="Home"
      screenOptions={{ headerBackTitleVisible: false }}
    >
      <StackHome.Screen
        name="Home"
        component={HomeScreen}
        options={{ animation: "none" }}
        //    options={{ title: "Home" }}
      />
      <StackHome.Screen
        name="MyGroups"
        component={MyGroupsScreen}
        options={{ animation: "none" }}
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
      <StackHome.Screen name="EditPost" component={EditPostScreen} />
      <StackHome.Screen name="ViewPost" component={ViewPostScreen} />
      <StackHome.Screen
        name="GroupInfo"
        component={GroupInfoScreen}
        options={{ animation: "none" }}
      />
      <StackHome.Screen name="DeleteGroup" component={DeleteGroupScreen} />
      <StackHome.Screen
        name="HelpLoggedIn"
        component={HelpScreen}
        options={{ title: "Nuubi How-To" }}
      />
      <StackHome.Screen name="DeleteMember" component={DeleteMemberScreen} />
      <StackHome.Screen name="JoinGroup" component={JoinGroupWithPasscode} />
    </StackHome.Navigator>
  );
}

const StackSearch = createNativeStackNavigator();

function SearchStack() {
  return (
    <StackSearch.Navigator
      initialRouteName="ViewAllGroups"
      screenOptions={{ headerBackTitleVisible: false }}
    >
      <StackSearch.Screen name="ViewAllGroups" component={GroupListScreen} />
      <StackSearch.Screen name="EditGroup" component={EditGroupScreen} />
      <StackSearch.Screen name="Group Chat" component={ChatScreen} />
      <StackSearch.Screen name="PostScreen" component={PostScreen} />
      <StackSearch.Screen name="CreatePost" component={CreatePostScreen} />
      <StackSearch.Screen name="EditPost" component={EditPostScreen} />
      <StackSearch.Screen name="ViewPost" component={ViewPostScreen} />
      <StackSearch.Screen name="GroupInfo" component={GroupInfoScreen} />
      <StackSearch.Screen name="DeleteGroup" component={DeleteGroupScreen} />
      <StackSearch.Screen name="DeleteMember" component={DeleteMemberScreen} />
      <StackSearch.Screen name="JoinGroup" component={JoinGroupWithPasscode} />
    </StackSearch.Navigator>
  );
}

const StackAuth = createNativeStackNavigator();

function AuthStack() {
  return (
    <StackAuth.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerBackTitleVisible: false }}
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

      <StackAuth.Screen name="LearnMore1" component={LearnMore1Screen} />
      <StackAuth.Screen name="LearnMore2" component={LearnMore2Screen} />
      <StackAuth.Screen name="LearnMore4" component={LearnMore4Screen} />
      <StackAuth.Screen name="LearnMore7" component={LearnMore7Screen} />
      <StackAuth.Screen name="PrivacyScreen" component={PrivacyScreen} />
      <StackAuth.Screen name="TermsScreen" component={TermsScreen} />
      <StackAuth.Screen
        name="HelpLoggedOut"
        component={HelpScreen}
        options={{ title: "Nuubi How-To" }}
      />
    </StackAuth.Navigator>
  );
}

const StackAddGroup = createNativeStackNavigator();

function AddGroupStack() {
  return (
    <StackAddGroup.Navigator
      initialRouteName="AddGroup"
      screenOptions={{ headerBackTitleVisible: false }}
    >
      <StackSearch.Screen name="AddGroup" component={AddGroupScreen} />
      <StackSearch.Screen name="JoinGroup" component={JoinGroupWithPasscode} />
      <StackSearch.Screen name="CreateGroup" component={CreateGroupScreen} />
    </StackAddGroup.Navigator>
  );
}

const StackNotifications = createNativeStackNavigator();

function NotificationsStack() {
  return (
    <StackNotifications.Navigator
      initialRouteName="Notifications"
      screenOptions={{ headerBackTitleVisible: false }}
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
  let assets1 = useAssets([require("../assets/icons/HomeFocused.png")]);
  let assets2 = useAssets([require("../assets/icons/Home.png")]);
  let assets3 = useAssets([require("../assets/icons/SearchFocused.png")]);
  let assets4 = useAssets([require("../assets/icons/Search.png")]);
  let assets5 = useAssets([require("../assets/icons/AddFocused.png")]);
  let assets6 = useAssets([require("../assets/icons/Add.png")]);
  let assets7 = useAssets([require("../assets/icons/NotificationFocused.png")]);
  let assets8 = useAssets([require("../assets/icons/Notification.png")]);
  let assets9 = useAssets([require("../assets/icons/ProfileFocused.png")]);
  let assets10 = useAssets([require("../assets/icons/Profile.png")]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case "HomeStack":
              return (
                <Image
                  source={
                    Platform.OS == "web"
                      ? focused
                        ? require("../assets/icons/HomeFocused.png")
                        : require("../assets/icons/Home.png")
                      : focused
                      ? assets1[0]
                      : assets2[0]
                  }
                  style={{ width: 24, height: 24 }}
                />
              );
            case "SearchStack":
              return (
                <Image
                  source={
                    Platform.OS == "web"
                      ? focused
                        ? require("../assets/icons/SearchFocused.png")
                        : require("../assets/icons/Search.png")
                      : focused
                      ? assets3[0]
                      : assets4[0]
                  }
                  style={{ width: 24, height: 24 }}
                />
              );
            case "AddGroupStack":
              return (
                <Image
                  source={
                    Platform.OS == "web"
                      ? focused
                        ? require("../assets/icons/AddFocused.png")
                        : require("../assets/icons/Add.png")
                      : focused
                      ? assets5[0]
                      : assets6[0]
                  }
                  style={{ width: 24, height: 24 }}
                />
              );
            case "NotificationsStack":
              return (
                <Image
                  source={
                    Platform.OS == "web"
                      ? focused
                        ? require("../assets/icons/NotificationFocused.png")
                        : require("../assets/icons/Notification.png")
                      : focused
                      ? assets7[0]
                      : assets8[0]
                  }
                  style={{ width: 24, height: 24 }}
                />
              );
            case "SettingsStack":
              return (
                <Image
                  source={
                    Platform.OS == "web"
                      ? focused
                        ? require("../assets/icons/ProfileFocused.png")
                        : require("../assets/icons/Profile.png")
                      : focused
                      ? assets9[0]
                      : assets10[0]
                  }
                  style={{ width: 24, height: 24 }}
                />
              );
            default:
              const ImageSource =
                Platform.OS == "web"
                  ? require("../assets/icons/HomeFocused.png")
                  : assets1[0];
          }
          return (
            <Image
              source={
                Platform.OS == "web"
                  ? require("../assets/icons/HomeFocused.png")
                  : assets1[0]
              }
              style={{ width: 24, height: 24 }}
            />
          );
        },
        tabBarInactiveTintColor: "#767676",
        tabBarActiveTintColor: "#33b7f0",
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="SearchStack" component={SearchStack} />
      <Tab.Screen name="AddGroupStack" component={AddGroupStack} />
      <Tab.Screen name="NotificationsStack" component={NotificationsStack} />
      <Tab.Screen name="SettingsStack" component={SettingsStack} />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

export default function Views() {
  const { user } = useContext(AccountContext);

  const isLoggedIn = user.token != null && user.token != "undefined";
  console.log("hi from views page");
  console.log("isLoggedIn: " + isLoggedIn);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="BottomTabs" component={TabNavigator} />
      ) : (
        <Stack.Screen
          name="Signin"
          component={AuthStack}
          options={{
            title: "Log in",
          }}
        />
      )}
    </Stack.Navigator>
  );
}
