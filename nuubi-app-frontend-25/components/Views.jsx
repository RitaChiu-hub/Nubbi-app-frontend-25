import "react-native-gesture-handler";
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";

import { Image, Platform } from "react-native";
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
import LoadingChat from "./Groups/LoadingChat";
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

import LearnMore1Screen from "./Onboarding/LearnMore1";
import LearnMore2Screen from "./Onboarding/LearnMore2";
import LearnMore4Screen from "./Onboarding/LearnMore4";
import LearnMore7Screen from "./Onboarding/LearnMore7";
import PrivacyScreen from "./Onboarding/Privacy";
import TermsScreen from "./Onboarding/Terms";

import ProfilePageScreen from "./UserSettings/ProfilePage";
import OverallAchievements from "./UserSettings/OverallAchievements";

const HomeDrawer = createDrawerNavigator();

function HomeDrawerNavigator() {
  return (
    <HomeDrawer.Navigator>
      <HomeDrawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          animation: "none",
          title: "Home Feed",
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
      />
      <HomeDrawer.Screen
        name="MyGroups"
        component={MyGroupsScreen}
        //  options={{ drawerItemStyle: { display: "none" } }}
        options={{
          animation: "none",
          title: "My Groups",
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
      />
      <HomeDrawer.Screen
        name="ViewAllGroups"
        component={GroupListScreen}
        options={{
          title: "Discover",
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
      />
      <HomeDrawer.Screen
        name="AddGroup"
        component={AddGroupScreen}
        options={{
          title: "Add Group",
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
      />
      <HomeDrawer.Screen
        name="Loading Chat"
        component={LoadingChat}
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
        //  options={{ drawerLabel: () => null }}
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
        //   options={{ animation: "none" }}
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
        name="Notifications"
        component={NotificationsScreen}
        options={{
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
      />

      <HomeDrawer.Screen
        name="ProfilePage"
        component={ProfilePageScreen}
        options={{
          title: "Profile",
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
        options={{
          title: "General Settings",
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
        //   options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{
          title: "Account Settings",
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
        // options={{ drawerItemStyle: { display: "none" } }}
      />

      <HomeDrawer.Screen
        name="HelpLoggedIn"
        component={HelpScreen}
        options={{
          title: "Help",
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
      />

      <HomeDrawer.Screen
        name="FeedbackScreen"
        component={FeedbackScreen}
        options={{
          title: "Contact Us",
          drawerLabelStyle: {
            fontFamily: "Poppins_500Medium",
          },
          drawerActiveTintColor: "#2482AA",
        }}
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
  return (
    <StackWeb.Navigator
      initialRouteName="Home Page"
      screenOptions={{ headerShown: false }}
    >
      <StackWeb.Screen name="Home Page" component={HomeDrawerNavigator} />
      {/* <StackWeb.Screen name="ProfilePage" component={ProfilePageScreen} />
      <StackWeb.Screen name="Settings" component={SettingsScreen} />
      <StackWeb.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
    </StackWeb.Navigator>
  );
}

const StackSettings = createNativeStackNavigator();

function SettingsStack() {
  return (
    <StackSettings.Navigator
      initialRouteName="ProfilePage"
      screenOptions={{ headerBackTitleVisible: false }}
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
      initialRouteName="Home"
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
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
      screenOptions={{ headerBackTitleVisible: false }}
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
  const [notifications, setNotifications] = React.useState(false);
  const { user } = useContext(AccountContext);

  const getNotifications = async () => {
    try {
      const response = await fetch(
        "https://coral-app-n96bn.ondigitalocean.app/groups/getnotificationsunread",
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
      // console.log(jsonData);
      setNotifications(jsonData.hasUnreadNotifications);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getNotifications();
  }, [user]);

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
  let assets11 = useAssets([require("../assets/icons/NotificationsTrue.png")]);

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
                    Platform.OS === "web"
                      ? focused
                        ? require("../assets/icons/NotificationFocused.png")
                        : notifications
                        ? require("../assets/icons/NotificationsTrue.png")
                        : require("../assets/icons/Notification.png")
                      : focused
                      ? assets7[0]
                      : notifications
                      ? assets11[0]
                      : assets8[0]
                  }
                  style={{ width: 24, height: 24 }}
                />
              );
            // return (
            //   <Image
            //     source={
            //       Platform.OS == "web"
            //         ? focused
            //           ? require("../assets/icons/NotificationFocused.png")
            //           : require("../assets/icons/Notification.png")
            //         : focused
            //         ? assets7[0]
            //         : assets8[0]
            //     }
            //     style={{ width: 24, height: 24 }}
            //   />
            // );
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
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        Platform.OS == "web" ? (
          <Stack.Screen
            name="DrawerTabs"
            component={WebStack}
            //  component={DrawerNavigator}
            //  screenOptions={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen name="BottomTabs" component={TabNavigator} />
        )
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
