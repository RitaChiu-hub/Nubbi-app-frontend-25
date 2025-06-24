import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import { AccountContext } from "./AccountContext";
import socket from "../socket";

export default function LtiLoginScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);

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
          "http://localhost:8080/lti/session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id_token: idToken }),
          }
        );

        const data = await res.json();
        if (data.success) {
          const { groupId, groupName, invitePasscode } = data;
          sessionStorage.setItem("nuubi_token", data.jwt);
          //  setUser({ ...data, loggedIn: true });

          setUser({
            ...data,
            loggedIn: true,
            currentGroup: groupId,
            groupName,
            invitePasscode,
          });
          // ✅ Connect socket now that we are logged in
          socket.auth = { token: data.jwt };
          if (!socket.connected) {
            socket.connect();
          }
          navigation.navigate("Group Tabs", { groupName });
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
