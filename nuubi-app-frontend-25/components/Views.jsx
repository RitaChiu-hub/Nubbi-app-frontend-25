import "react-native-gesture-handler";
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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

import CreateGroupScreen from "./Groups/CreateGroupScreen";
import EditGroupScreen from "./Groups/EditGroupScreen";
import GroupListScreen from "./Groups/GroupListScreen";
// import ChatScreen from "./Chat/ChatScreen";
// import PostScreen from "./Chat/PostScreen";
// import CreatePostScreen from "./Chat/CreatePost";
// import EditPostScreen from "./Chat/EditPost";
// import ViewPostScreen from "./Chat/ViewPostScreen";
// import GroupInfoScreen from "./Chat/GroupInfoScreen";
import DeleteGroupScreen from "./Groups/DeleteGroupScreen";
import DeleteMemberScreen from "./Groups/DeleteMemberScreen";
import JoinGroupWithPasscode from "./Groups/JoinGroupWithPasscode";

import LearnMore1Screen from "./Onboarding/LearnMore1";
import LearnMore2Screen from "./Onboarding/LearnMore2";
import LearnMore3Screen from "./Onboarding/LearnMore3";
import LearnMore4Screen from "./Onboarding/LearnMore4";
import LearnMore5Screen from "./Onboarding/LearnMore5";
import LearnMore6Screen from "./Onboarding/LearnMore6";
import LearnMore7Screen from "./Onboarding/LearnMore7";

const useAuth = () => {
  const { user } = useContext(AccountContext);
  return user && user.loggedIn;
};

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
      <StackHome.Screen
        name="ForgotPasswordLoggedIn"
        component={ForgotPasswordScreen}
      />
      <StackHome.Screen
        name="ChangeUsernameScreen"
        component={ChangeUsernameScreen}
      />
      <StackHome.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <StackHome.Screen name="Settings" component={SettingsScreen} />
      <StackHome.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <StackHome.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <StackHome.Screen
        name="ChangeUsername"
        component={ChangeUsernameScreen}
      />
      <StackHome.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />

      <StackHome.Screen name="CreateGroup" component={CreateGroupScreen} />
      <StackHome.Screen name="EditGroup" component={EditGroupScreen} />
      <StackHome.Screen name="ViewAllGroups" component={GroupListScreen} />
      {/* <StackHome.Screen name="ChatScreen" component={ChatScreen} />
			<StackHome.Screen name="PostScreen" component={PostScreen} />
			<StackHome.Screen name="CreatePost" component={CreatePostScreen} />
			<StackHome.Screen name="EditPost" component={EditPostScreen} />
			<StackHome.Screen name="ViewPost" component={ViewPostScreen} />
			<StackHome.Screen name="GroupInfo" component={GroupInfoScreen} /> */}
      <StackHome.Screen name="DeleteGroup" component={DeleteGroupScreen} />
      <StackHome.Screen name="DeleteMember" component={DeleteMemberScreen} />
      <StackHome.Screen name="JoinGroup" component={JoinGroupWithPasscode} />
    </StackHome.Navigator>
  );
}

const StackAuth = createNativeStackNavigator();

function AuthStack() {
  return (
    <StackAuth.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerBackTitleVisible: false }}
    >
      <StackAuth.Screen
        name="Splash"
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
      <StackAuth.Screen name="LearnMore3" component={LearnMore3Screen} />
      <StackAuth.Screen name="LearnMore4" component={LearnMore4Screen} />
      <StackAuth.Screen name="LearnMore5" component={LearnMore5Screen} />
      <StackAuth.Screen name="LearnMore6" component={LearnMore6Screen} />
      <StackAuth.Screen name="LearnMore7" component={LearnMore7Screen} />
    </StackAuth.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function Views() {
  const { user } = useContext(AccountContext);
  const isAuth = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user.loggedIn == false ? (
        <Stack.Screen
          name="Sign in"
          component={AuthStack}
          options={{
            title: "Log in",
          }}
        />
      ) : (
        <Stack.Screen name="HomeStack" component={HomeStack} />
      )}
    </Stack.Navigator>
  );
}
