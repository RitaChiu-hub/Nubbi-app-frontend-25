import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LtiLoginScreen() {
  const navigation = useNavigation();

  //   useEffect(() => {
  //     /** We land on …/lti-login?token=xxx */
  //     const params = new URLSearchParams(window.location.search);
  //     const token = params.get("token");

  //     if (token) {
  //       console.log("[Nuubi] id_token received:", token);
  //       sessionStorage.setItem("lti_id_token", token);

  //       // TODO: hit your /api/lti/session endpoint here if you want
  //       // await fetch("/api/lti/session", { … })

  //       navigation.replace("Home Page"); // or Dashboard, etc.
  //     } else {
  //       console.error("[Nuubi] No id_token in query-string.");
  //     }
  //   }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idToken = params.get("token");

    const loginViaCanvas = async () => {
      if (!idToken) {
        console.error("No id_token in URL");
        return;
      }

      try {
        const res = await fetch(
          "https://coral-app-n96bn.ondigitalocean.app/lti/session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id_token: idToken }),
          }
        );

        const data = await res.json();
        if (data.success) {
          sessionStorage.setItem("nuubi_token", data.jwt);
          console.log("Logged in as:", data.email);
          console.log("✅ Nuubi LTI Session Response:");
          console.log(JSON.stringify(data, null, 2));
          //   navigation.replace("GroupPage", { email: data.email }); // Or whatever your next screen is
        } else {
          console.error("LTI login failed:", data.error);
        }
      } catch (err) {
        console.error("LTI login error:", err);
      }
    };

    loginViaCanvas();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator />
      <Text>Logging you in via Canvas…</Text>
    </View>
  );
}
