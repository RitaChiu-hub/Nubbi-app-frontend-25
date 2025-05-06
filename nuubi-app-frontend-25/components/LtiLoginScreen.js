import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LtiLoginScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    /** We land on …/lti-login?token=xxx */
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      console.log("[Nuubi] id_token received:", token);
      // 🔍 quick peek (⚠️ no signature‑check)
      const decoded = require("jsonwebtoken").decode(token, {
        complete: true,
      });

      console.log("[Nuubi] ─ header  ────────────────");
      console.log(JSON.stringify(decoded.header, null, 2));

      console.log("[Nuubi] ─ payload / claims ─────");
      console.log(JSON.stringify(decoded.payload, null, 2));
      sessionStorage.setItem("lti_id_token", token);

      // TODO: hit your /api/lti/session endpoint here if you want
      // await fetch("/api/lti/session", { … })

      navigation.replace("Home Page"); // or Dashboard, etc.
    } else {
      console.error("[Nuubi] No id_token in query-string.");
    }
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator />
      <Text>Logging you in via Canvas…</Text>
    </View>
  );
}
