import "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Views from "./components/Views";
import { NavigationContainer } from "@react-navigation/native";
import UserContext from "./components/AccountContext";
import { Fragment } from "react";
import { StatusBar } from "expo-status-bar";
import { Linking } from "react-native";
// import * as Linking from "expo-linking";

import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";

//Freshpaint.init("e1f8844c-e8e6-4bba-81b8-9873888789b1");
// const FreshpaintNavigationContainer =
//   Freshpaint.withReactNavigationAutotrack(NavigationContainer);

export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  const linking = {
    config: {
      screens: {
        DrawerTabs: {
          screens: {
            HomePage: {
              screens: {
                Home: "home",
                MyGroups: "mygroups",
                GroupChat: "chat",
                PostScreen: "posts",
                GroupInfo: "group",
                GroupAnalytics: "analytics",
                GroupAchievements: "achievements",
                ViewAllGroups: "allgroups",
                AddGroup: "addgroup",
                JoinGroup: "join",
                Creategroup: "create",
                Notifications: "notfications",
                ProfilePage: "profilepage",
                Settings: "settings",
                AccountScreen: "me",
                HelpLoggedIn: "help",
                FeedbackScreen: "contact",
                ChangeUsernameScreen: "update-username",
                ChangePasswordScreen: "update-password",
                ForgotPassword: "forgot-password",
              },
            },
          },
        },
        AuthStack: {
          screens: {
            LandingPage: "signin/landingpage",
            Welcome: "signin/welcome",
            Login: "signin/login",
            SignUp: "signin/signup",
            ForgotPasswordLoggedOut: "signin/forgot-password",
            CodeVerificationScreen: "signin/verify-code",
            LearnMore1: "signin/learn-more-1",
            LearnMore2: "signin/learn-more-2",
            LearnMore4: "signin/learn-more-4",
            LearnMore7: "signin/learn-more-7",
            PrivacyScreen: "signin/privacy",
            TermsScreen: "signin/terms",
            FeedbackScreen: "signin/feedback",
            HelpLoggedOut: "signin/help",
          },
        },
        LandingStack: {
          screens: {
            LandingPage: "landingpage", // Landing page as a separate stack
            SplashScreen: "splash",
          },
        },
      },
    },
    persist: true,
  };

  const pathname = window.location.pathname;
  console.log("my path name is: " + pathname);

  // Check if the path includes 'LandingPage'
  const containsLandingPage = pathname.toLowerCase().includes("landingpage");
  console.log("Does the path contain 'LandingPage'? " + containsLandingPage);

  return (
    <Fragment>
      <StatusBar style="dark" />
      <UserContext>
        <NavigationContainer
          linking={linking}
          landingPage={containsLandingPage}
        >
          <Views landingPage={containsLandingPage} />
        </NavigationContainer>
      </UserContext>
    </Fragment>
  );
}
