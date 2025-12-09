import React, { Fragment, useEffect, useState, Suspense, useRef } from "react";
import { Platform, AppState } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Views from "./components/Views";
import UserContext from "./components/AccountContext";
import * as Notifications from "expo-notifications";
import { navigationRef } from "./components/navRef";
import { installSessionGuard } from "./components/sessionGuard";
import sessionService from "./services/sessionService";

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
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

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

  // Handle app state changes (mobile only)
  useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }

    const subscription = AppState.addEventListener("change", async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground");
        // Resume heartbeat when app comes to foreground
        try {
          // Check if session exists, restore if needed
          const storedSessionId = await sessionService.getStoredSessionId();
          if (storedSessionId) {
            await sessionService.storeSessionId(storedSessionId);
            sessionService.startHeartbeat();
          } else {
            // Try to get current session from backend
            const currentSession = await sessionService.getCurrentSession();
            if (currentSession) {
              await sessionService.storeSessionId(currentSession.session_id);
              sessionService.startHeartbeat();
            } else {
              // Start new session if user is logged in
              const token = await sessionService.getToken();
              if (token) {
                await sessionService.startSession();
              }
            }
          }
        } catch (error) {
          console.error("Error restoring session on foreground:", error);
          // Non-blocking: try to start heartbeat anyway
          sessionService.startHeartbeat();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        console.log("App has gone to the background");
        // Pause heartbeat when app goes to background
        sessionService.stopHeartbeat();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  // Cleanup on unmount (web only - handle page unload)
  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    const handleBeforeUnload = () => {
      // End session when page is about to unload
      sessionService.endSession();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Track navigation for analytics
  const routeNameRef = useRef();

  const onNavigationReady = () => {
    routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
  };

  const onNavigationStateChange = async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName && currentRouteName) {
      // Track page view when route changes
      try {
        await sessionService.trackPageView(currentRouteName);
      } catch (error) {
        console.error("Error tracking page view:", error);
      }
    }

    // Save the current route name for next comparison
    routeNameRef.current = currentRouteName;
  };

  return (
    <Fragment>
      <StatusBar style="dark" />
      <UserContext>
        <SafeAreaProvider>
          <NavigationContainer
            ref={navigationRef}
            linking={linking}
            landingPage={containsLandingPage}
            inviteToken={inviteToken}
            onReady={onNavigationReady}
            onStateChange={onNavigationStateChange}
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
