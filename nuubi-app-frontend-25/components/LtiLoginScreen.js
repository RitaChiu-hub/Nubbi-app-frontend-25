import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

const LtiLoginScreen = () => {
  const navigation = useNavigation(); // ✅ get navigation here

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "LTI_ID_TOKEN") {
        sessionStorage.setItem("lti_id_token", event.data.token);
        navigation.replace("Home Page");
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator />
      <Text>Logging you in via Canvas...</Text>
    </View>
  );
};

export default LtiLoginScreen;
