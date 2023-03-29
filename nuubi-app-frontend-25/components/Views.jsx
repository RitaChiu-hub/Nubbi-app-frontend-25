import "react-native-gesture-handler";
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AccountContext } from "./AccountContext";

import LoginScreen from "./Login/LoginScreen";
import SignUpScreen from "./Login/SignUpScreen";

import HomeScreen from "./HomeScreen";
import SplashScreen from "./SplashScreen";

import LearnMore1Screen from "./Onboarding/LearnMore1";
import LearnMore2Screen from "./Onboarding/LearnMore2";
import LearnMore3Screen from "./Onboarding/LearnMore3";
import LearnMore4Screen from "./Onboarding/LearnMore4";
import LearnMore5Screen from "./Onboarding/LearnMore5";
import LearnMore6Screen from "./Onboarding/LearnMore6";
import LearnMore7Screen from "./Onboarding/LearnMore7";

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
