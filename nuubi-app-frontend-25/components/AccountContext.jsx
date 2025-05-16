import * as SecureStore from "expo-secure-store";
const { createContext, useState, useEffect } = require("react");
import { Platform } from "react-native";
import socket from "../socket";

export const AccountContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({ token: null });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // let myToken;
  // if (Platform.OS === "web") {
  //   myToken = null;
  // } else {
  //   getToken = SecureStore.getItemAsync("token");
  //   if (getToken._j != null) {
  //     myToken = getToken._j;
  //   } else {
  //     myToken = null;
  //   }
  // }

  // const [user, setUser] = useState({
  //   token: myToken,
  // });

  // connect/disconnect socket exactly once when login state changes
  useEffect(() => {
    if (isLoggedIn && !socket.connected) {
      socket.auth = { token: user.token };
      socket.connect();
    } else if (!isLoggedIn && socket.connected) {
      console.log("Not logged in, and socket is connected");
      // socket.disconnect();
    }
  }, [isLoggedIn, user.token]);

  return (
    <AccountContext.Provider
      value={{ user, setUser, isLoggedIn, setIsLoggedIn }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;
