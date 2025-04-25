import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

const LtiLoginScreen = () => {
  const navigation = useNavigation(); // ✅ get navigation here

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      console.log("LTI id_token received:", token);
      sessionStorage.setItem("lti_id_token", token);
      navigation.replace("Home Page"); // or Dashboard
    } else {
      console.error("No id_token found in URL");
    }
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator />
      <Text>Logging you in via Canvas...</Text>
    </View>
  );
};

export default LtiLoginScreen;
