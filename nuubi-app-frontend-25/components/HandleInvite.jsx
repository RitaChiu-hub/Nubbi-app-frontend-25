import React, { useEffect, useContext } from "react";
import { ActivityIndicator, View, Alert, Platform, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AccountContext } from "./AccountContext";

const HandleInviteScreen = () => {
  const { user, setUser } = React.useContext(AccountContext);
  const { isLoggedIn, setIsLoggedIn } = React.useContext(AccountContext);

  const navigation = useNavigation();
  const route = useRoute();

  const inviteToken = window.location.pathname
    .toLowerCase()
    .includes("groups/invite")
    ? window.location.pathname.split("/groups/invite/")[1]
    : null;

  console.log("HANDLE INVITE TOKEN  22222: " + inviteToken);

  // if the token is null, just redirect to some other page...

  // now check and see if someone is authenticated or not

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
        `https://coral-app-n96bn.ondigitalocean.app/auth/checkweblogin`,
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

  React.useEffect(() => {
    // Only run if landingPage is false
    const checkLoginStatus = async () => {
      const loggedIn = await checkIsLoggedIn(); // Call the async login check
      console.log("user is loggedin: " + loggedIn);
      //   setIsLoggedIn(loggedIn);
    };

    checkLoginStatus(); // Run the check when the component mounts
  }, []);

  // change token to inviteToken to not get mixed up with user token

  //   useEffect(() => {
  //     const processInvite = async () => {
  //       if (!token || token === "null") {
  //         // If token is invalid, navigate to the default stack
  //         if (Platform.OS === "web") {
  //           navigation.navigate("DrawerTabs");
  //         } else {
  //           navigation.navigate("BottomTabs");
  //         }
  //         return;
  //       }

  //       try {
  //         // Call the backend to validate the token
  //         const response = await fetch(
  //           `http://localhost:8080/groups/invite/${token}`,
  //           //    `https://your-backend.com/invite/${token}`
  //           {
  //             method: "GET",
  //             credentials: "include", // Include cookies for authentication
  //           }
  //         );

  //         const data = await response.json();

  //         if (response.ok) {
  //           const { groupId, isAuthenticated } = data;

  //           if (isAuthenticated) {
  //             // Navigate directly to the group if authenticated
  //             if (Platform.OS === "web") {
  //               console.log(
  //                 "Hi! You have an invite token and you're authenticated via web. It is: " +
  //                   token
  //               );
  //               //   navigation.navigate("DrawerTabs", {
  //               //     screen: "PostScreen", //will need to change this I think to be able to add the groupId
  //               //     params: { groupId },
  //               //   });
  //             } else {
  //               console.log(
  //                 "Hi! You have an invite token and you're authenticated via MOBILE. It is: " +
  //                   token
  //               );
  //               //   navigation.navigate("BottomTabs", {
  //               //     screen: "PostScreen", //will need to change this I think to be able to add the groupId
  //               //     params: { groupId },
  //               //   });
  //             }
  //           } else {
  //             console.log("Hi!!!! You got invited to " + token);
  //             // Redirect to login/signup with the token
  //             // navigation.navigate("AuthStack", {
  //             //   screen: "SignUp",
  //             //   params: { inviteToken: token },
  //             // });
  //           }
  //         } else {
  //           Alert.alert("Error", data.error || "Invalid invite link.");
  //           //   if (Platform.OS === "web") {
  //           //     navigation.navigate("DrawerTabs");
  //           //   } else {
  //           //     navigation.navigate("BottomTabs");
  //           //   }
  //         }
  //       } catch (error) {
  //         console.error("Error processing invite:", error);
  //         // Alert.alert("Error", "Something went wrong.");
  //         // if (Platform.OS === "web") {
  //         //   navigation.navigate("DrawerTabs");
  //         // } else {
  //         //   navigation.navigate("BottomTabs");
  //         // }
  //       }
  //     };

  //     processInvite();
  //   }, [token, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* <ActivityIndicator size="large" /> */}
      <Text>Hi! You got an invite to a group! </Text>
      <Text>Are you logged in? ${isLoggedIn} </Text>
    </View>
  );
};

export default HandleInviteScreen;
