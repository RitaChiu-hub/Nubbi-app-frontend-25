import * as SecureStore from "expo-secure-store";
const { createContext, useState, useEffect } = require("react");
import { Platform } from "react-native";
import Cookies from "js-cookie"; // For web platform

export const AccountContext = createContext();

const UserContext = ({ children }) => {
  let myToken;
  if (Platform.OS === "web") {
    myToken = Cookies.get("token"); // localStorage.getItem("token");
  } else {
    getToken = SecureStore.getItemAsync("token");
    if (getToken._j != null) {
      myToken = getToken._j;
    } else {
      myToken = null;
    }
  }

  const [user, setUser] = useState({
    // loggedIn: null,
    token: myToken,
    // userId: null,
    // currentGroup: null,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch(`https://coral-app-n96bn.ondigitalocean.app/auth/login`, {
      credentials: "include",
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    })
      .catch((err) => {
        setUser({ token: null });
        setIsLoggedIn(false);
        return;
      })
      .then((r) => {
        if (!r || !r.ok || r.status >= 400) {
          setUser({ token: null });
          setIsLoggedIn(false);
          return;
        }
        return r.json();
      });
    //   .then((data) => {
    //     if (!data) {
    //       console.log("C happened to set it to false");
    //       setUser({ loggedIn: false, message3: "C" });
    //       return;
    //     }
    //     setUser({ ...data, message: "Hi from account context" });
    //     console.log("D happened to set it to false");
    // });
  }, []);
  return (
    // <AccountContext.Provider value={{ user, setUser }}>
    <AccountContext.Provider
      value={{ user, setUser, isLoggedIn, setIsLoggedIn }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;
