import React, { useEffect, useContext } from "react";
import { ActivityIndicator, View, Alert, Platform, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AccountContext } from "./AccountContext";

const HandleInviteScreen = () => {
  const { user, setUser } = React.useContext(AccountContext);
  const { isLoggedIn, setIsLoggedIn } = React.useContext(AccountContext);

  const navigation = useNavigation();

  const inviteToken = window.location.pathname
    .toLowerCase()
    .includes("groups/invite")
    ? window.location.pathname.split("/groups/invite/")[1]
    : null;

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
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus(); // Run the check when the component mounts
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      // If the user is not logged in, show a message and stop further execution
      return;
    }

    const handleInvite = async () => {
      const token =
        Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : null; // Get token only on mobile

      if (!inviteToken || inviteToken == "undefined") {
        Alert.alert("Error", "Invalid invite token.");
        navigation.navigate("Home"); // Navigate to a default page
        return;
      }
      try {
        // Call backend to validate invite and add user to group
        const response = await fetch(
          `http://localhost:8080/groups/invite/${inviteToken}`,
          {
            method: "POST",
            credentials: "include", // Include cookies for authentication
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ ...user }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          const { groupId, groupName, invitePasscode, message } = data;
          setUser({
            ...user,
            currentGroup: groupId,
            groupName: groupName,
            invitePasscode: invitePasscode,
          });

          navigation.navigate("Group Tabs", { groupName: groupName });

          //   navigation.navigate("DrawerTabs", { handleInvite: true });
        } else {
          Alert.alert("Error", data.error || "Could not join the group.");
          //  navigation.navigate("DrawerTabs"); // Navigate to a fallback screen
        }
      } catch (error) {
        console.error("Error processing invite:", error);
        Alert.alert("Error", "Something went wrong.");
        //   navigation.navigate("DrawerTabs"); // Navigate to a fallback screen
      }
    };

    handleInvite();
  }, [inviteToken, navigation, isLoggedIn]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {isLoggedIn ? (
        // Show a loading indicator while processing the invite
        <ActivityIndicator size="large" />
      ) : (
        // Show a message if the user is not logged in
        <Text>You're not logged in!</Text>
      )}
    </View>
  );
};

export default HandleInviteScreen;
