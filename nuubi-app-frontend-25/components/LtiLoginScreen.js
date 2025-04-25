import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

const LtiLoginScreen = () => {
  //   const navigation = useNavigation();

  //   useEffect(() => {
  //     const params = new URLSearchParams(window.location.search);
  //     const userId = params.get("user");
  //     const courseId = params.get("course");
  //     const name = params.get("name");
  //     const email = params.get("email");

  //     if (userId && courseId) {
  //       fetch("https://www.nuubi.app/api/lti/session", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ userId, courseId, name, email }),
  //         credentials: "include",
  //       })
  //         .then((res) => res.json())
  //         .then((data) => {
  //           if (data.success) {
  //             navigation.replace("Dashboard"); // Or wherever you want to go next
  //           }
  //         })
  //         .catch((err) => {
  //           console.error("LTI login failed:", err);
  //         });
  //     }
  //   }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator />
      <Text>Logging you in via Canvas...</Text>
    </View>
  );
};

export default LtiLoginScreen;
