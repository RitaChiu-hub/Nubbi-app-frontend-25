import "react-native-gesture-handler";
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
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
    <HomeDrawer.Navigator
      backBehavior="history"
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#2482AA",
        },
        headerTintColor: "#FDFDFD",
      }}
    >
      <HomeDrawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          animation: "none",
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="house"
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
                My Feed
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
        name="ViewAllGroups"
        component={GroupListScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <HomeDrawer.Screen
        name="AddGroup"
        component={AddGroupScreen}
        options={{ drawerItemStyle: { display: "none" } }}
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
                Activity Center
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
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6
                name="gear"
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
                General Settings
              </Text>
            </View>
          ),
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
        options={{ drawerItemStyle: { display: "none" } }}
      />

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
                Help Center
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
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#2482AA",
        },
        headerTintColor: "#FDFDFD",
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
      initialRouteName="Home"
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#2482AA",
        },
        headerTintColor: "#FDFDFD",
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
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#2482AA",
        },
        headerTintColor: "#FDFDFD",
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
        headerTintColor: "#FDFDFD",
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
        },
        headerTintColor: "#FDFDFD",
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
        //    options={{ title: "My Groups" }}
      />

      <StackMyGroups.Screen name="EditGroup" component={EditGroupScreen} />
      <StackMyGroups.Screen name="Group Chat" component={ChatScreen} />
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
    </StackMyGroups.Navigator>
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
        headerTintColor: "#FDFDFD",
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
  const { user } = useContext(AccountContext);
  const [avatarInfo, setAvatarInfo] = React.useState(null);

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

  const getUserAvatar = async () => {
    try {
      const response = await fetch(
        "https://coral-app-n96bn.ondigitalocean.app/settings/getuseravatar",
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
      setAvatarInfo(jsonData.avatar_url.avatar_url);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getNotifications();
    getUserAvatar();
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
              label = "Feed";
              break;
            case "SearchStack":
              label = "Discover";
              break;
            case "MyGroupsStack":
              label = "Groups";
              break;
            case "NotificationsStack":
              label = "Activity";
              break;
            case "SettingsStack":
              label = "Profile";
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
                  name="house"
                  style={{
                    color: focused ? "#2482AA" : "#767676",
                  }}
                  size={24}
                />
              );
            case "SearchStack":
              return (
                <FontAwesome6
                  name="magnifying-glass"
                  style={{
                    color: focused ? "#2482AA" : "#767676",
                  }}
                  size={24}
                />
              );
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
              return avatarInfo ? (
                <View
                  style={[
                    styles.avatarContainer,
                    focused && styles.avatarContainerFocused,
                  ]}
                >
                  <Image source={{ uri: avatarInfo }} style={styles.avatar} />
                </View>
              ) : (
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
        options={{ tabBarLabel: "Feed" }}
      />
      <Tab.Screen
        name="SearchStack"
        component={SearchStack}
        options={{ tabBarLabel: "Discover" }}
      />
      <Tab.Screen
        name="MyGroupsStack"
        component={MyGroupsStack}
        options={{ tabBarLabel: "Groups" }}
      />
      <Tab.Screen
        name="NotificationsStack"
        component={NotificationsStack}
        options={{ tabBarLabel: "Activity" }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

export default function Views() {
  const { user } = useContext(AccountContext);

  const isLoggedIn = user.token != null && user.token != "undefined";
  const isMobileLoggedIn = user.loggedIn === true ? true : false;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn && Platform.OS == "web" ? (
        <Stack.Screen name="DrawerTabs" component={WebStack} />
      ) : isMobileLoggedIn && Platform.OS != "web" ? (
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
