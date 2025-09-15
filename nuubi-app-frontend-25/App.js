import React, { Fragment, useEffect, useState, Suspense } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Views from "./components/Views";
import UserContext from "./components/AccountContext";
import * as Notifications from "expo-notifications";
import { navigationRef } from "./components/navRef";
import { installSessionGuard } from "./components/sessionGuard";

// installSessionGuard();
if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });
}

const isWeb = Platform.OS === "web";
const Elements = isWeb
  ? React.lazy(() =>
      import("@stripe/react-stripe-js").then((mod) => ({
        default: mod.Elements,
      }))
    )
  : null;

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
import Canvas from "react-native-canvas";

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
    prefixes: [
      "https://www.nuubi.app",
      "https://nuubi.app",
      "https://www.nuubi.com",
      "https://nuubi.com",
      "https://xnlvhxq-kittykat-8081.exp.direct/",
    ],
    config: {
      screens: {
        Canvas: "lti-login",
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
            GroupTabs: {
              path: "groups/:groupId",
              screens: {
                GroupPosts: "posts",
              },
            },
            //  HandleInvite: "groups/invite/:invitetoken", // Ensure HandleInvite is also defined here
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
            //  HandleInvite: "groups/invite/:token",
          },
        },
        LandingStack: {
          screens: {
            LandingPage: "landingpage", // Landing page as a separate stack
            SplashScreen: "splash",
          },
        },
        HandleInviteNavigator: {
          path: "groups/invite/:invitetoken",
          screens: {
            HandleInvite: "",
            SignUp: "/signup",
            Login: "/login",
            //  CodeVerificationScreen: "verify",
            // Add other nested screens here
          },
        },
        //   HandleInvite: "groups/invite/:token",
      },
    },
    persist: true,
  };

  const isMobile = Platform.OS !== "web";

  // For mobile platforms, set landingPage to false
  const containsLandingPage = isMobile
    ? false
    : window.location.pathname.toLowerCase().includes("landingpage");

  const inviteToken = isMobile
    ? null
    : window.location.pathname.toLowerCase().includes("groups/invite")
    ? window.location.pathname.split("/groups/invite/")[1]
    : null;

  const [StripeProvider, setStripeProvider] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    if (!isWeb) {
      import("@stripe/stripe-react-native").then((mod) => {
        setStripeProvider(() => mod.StripeProvider);
      });
    } else {
      import("@stripe/stripe-js").then((mod) => {
        setStripePromise(
          mod.loadStripe(
            "pk_test_51LJPaMGxdxKNnJqJrQc1DZHLMO0wHS2zmPCNeKQxENFifWl5kfnQnIuzu629Mpk76jvQK2TGAPHIdN3m2a2k5qeQ00MIRhno5P"
          )
        );
      });
    }
  }, []);

  return (
    <Fragment>
      <StatusBar style="dark" />
      <UserContext>
        <SafeAreaProvider>
          <NavigationContainer
            //  ref={navigationRef}
            linking={linking}
            landingPage={containsLandingPage}
            inviteToken={inviteToken}
          >
            <Suspense>
              <Views
                landingPage={containsLandingPage}
                inviteToken={inviteToken}
              />
            </Suspense>
            {/* <Suspense
              fallback={
                <Views
                  landingPage={containsLandingPage}
                  inviteToken={inviteToken}
                />
              }
            > */}
            {/* {isWeb && Elements && stripePromise ? (
                <Elements stripe={stripePromise}>
                  <Views
                    landingPage={containsLandingPage}
                    inviteToken={inviteToken}
                  />
                </Elements>
              ) : StripeProvider ? (
                <StripeProvider publishableKey="pk_test_51LJPaMGxdxKNnJqJrQc1DZHLMO0wHS2zmPCNeKQxENFifWl5kfnQnIuzu629Mpk76jvQK2TGAPHIdN3m2a2k5qeQ00MIRhno5P">
                  <Views
                    landingPage={containsLandingPage}
                    inviteToken={inviteToken}
                  />
                </StripeProvider>
              ) : (
                <Views
                  landingPage={containsLandingPage}
                  inviteToken={inviteToken}
                />
              )} */}
            {/* </Suspense> */}
          </NavigationContainer>
        </SafeAreaProvider>
      </UserContext>
    </Fragment>
  );
}
