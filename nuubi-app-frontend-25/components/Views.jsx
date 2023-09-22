import "react-native-gesture-handler";
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { Text, View } from "react-native";

import { useContext } from "react";
import { AccountContext } from "./AccountContext";

import LoginScreen from "./Login/LoginScreen";
import SignUpScreen from "./Login/SignUpScreen";

import HomeScreen from "./HomeScreen";
import SplashScreen from "./SplashScreen";

import SettingsScreen from "./UserSettings/SettingsScreen";
import DeleteAccountScreen from "./UserSettings/DeleteAccount";
import ChangeUsernameScreen from "./UserSettings/ChangeUsername";
import ChangePasswordScreen from "./UserSettings/ChangePassword";
import ForgotPasswordScreen from "./UserSettings/ForgotPassword";
import ForgotPasswordLoggedOut from "./UserSettings/ForgotPasswordLoggedOut";
import HelpScreen from "./Onboarding/HelpPage";

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

const useAuth = () => {
  const { user } = useContext(AccountContext);
  return user && user.loggedIn;
};

const StackSettings = createNativeStackNavigator();

function SettingsStack() {
  return (
    <StackSettings.Navigator
      initialRouteName="Settings"
      screenOptions={{ headerBackTitleVisible: false }}
      // screenOptions={{ headerShown: false }}
    >
      <StackSettings.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />

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
    </StackSettings.Navigator>
  );
}

const StackHome = createNativeStackNavigator();

function HomeStack() {
  return (
    <StackHome.Navigator
      initialRouteName="Home"
      screenOptions={{ headerBackTitleVisible: false }}
      // screenOptions={{ headerShown: false }}
    >
      <StackHome.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />

      <StackHome.Screen name="CreateGroup" component={CreateGroupScreen} />
      <StackHome.Screen name="EditGroup" component={EditGroupScreen} />
      <StackHome.Screen name="Group Chat" component={ChatScreen} />
      <StackHome.Screen name="PostScreen" component={PostScreen} />
      <StackHome.Screen name="CreatePost" component={CreatePostScreen} />
      <StackHome.Screen name="EditPost" component={EditPostScreen} />
      <StackHome.Screen name="ViewPost" component={ViewPostScreen} />
      <StackHome.Screen name="GroupInfo" component={GroupInfoScreen} />
      <StackHome.Screen name="DeleteGroup" component={DeleteGroupScreen} />
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

      <StackAuth.Screen name="LearnMore1" component={LearnMore1Screen} />
      <StackAuth.Screen name="LearnMore2" component={LearnMore2Screen} />
      <StackAuth.Screen name="LearnMore4" component={LearnMore4Screen} />
      <StackAuth.Screen name="LearnMore7" component={LearnMore7Screen} />
      <StackAuth.Screen name="PrivacyScreen" component={PrivacyScreen} />
      <StackAuth.Screen
        name="HelpLoggedOut"
        component={HelpScreen}
        options={{ title: "Nuubi How-To" }}
      />
    </StackAuth.Navigator>
  );
}

function SearchScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Search!</Text>
    </View>
  );
}
function AddScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Add!</Text>
    </View>
  );
}
function NotificationScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Notifications!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case "HomeStack":
              iconName = focused ? "ios-home" : "ios-home-outline";
              break;
            case "SearchStack":
              iconName = focused ? "ios-search" : "ios-search-outline";
              break;
            case "Add":
              iconName = focused ? "ios-add-circle" : "ios-add-circle-outline";
              break;
            case "Notifications":
              iconName = focused
                ? "ios-notifications"
                : "ios-notifications-outline";
              break;
            case "SettingsStack":
              iconName = focused ? "ios-settings" : "ios-settings-outline";
              break;
            default:
              iconName = "ios-information-circle";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarInactiveTintColor: "#767676",
        tabBarActiveTintColor: "#33b7f0",
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="SearchStack" component={SearchStack} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="SettingsStack" component={SettingsStack} />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

export default function Views() {
  const { user } = useContext(AccountContext);
  const isAuth = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user.loggedIn == false ? (
        <Stack.Screen
          name="Signin"
          component={AuthStack}
          options={{
            title: "Log in",
          }}
        />
      ) : (
        <Stack.Screen name="BottomTabs" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
}
