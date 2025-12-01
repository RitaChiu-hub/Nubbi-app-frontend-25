import * as SecureStore from "expo-secure-store";
import { createContext, useState, useEffect } from "react";
import { Platform } from "react-native";
import socket from "../socket";

import { registerPushToken } from "./usePushNotifications";   // ✅ NEW

export const AccountContext = createContext();

const AccountProvider = ({ children }) => {
  const [user, setUser] = useState({ token: null });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load token from storage
  useEffect(() => {
    async function loadToken() {
      const token =
        Platform.OS === "web"
          ? sessionStorage.getItem("token")
          : await SecureStore.getItemAsync("token");

      if (token) {
        setUser({ token });
        setIsLoggedIn(true);
      }
    }
    loadToken();
  }, []);

  // Connect socket when logged in
  useEffect(() => {
    if (isLoggedIn && !socket.connected) {
      socket.auth = { token: user.token };
      socket.connect();
    } else if (!isLoggedIn && socket.connected) {
      console.log("Not logged in, and socket is connected");
    }
  }, [isLoggedIn, user.token]);

  // ✅ REGISTER PUSH TOKEN WHEN USER LOGS IN
  useEffect(() => {
    if (isLoggedIn && user?.token) {
      console.log("🔔 Registering push token for logged-in user…");
      registerPushToken(user.token);
    }
  }, [isLoggedIn, user]);

  return (
    <AccountContext.Provider
      value={{ user, setUser, isLoggedIn, setIsLoggedIn }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
