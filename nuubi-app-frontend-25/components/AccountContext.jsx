import * as SecureStore from "expo-secure-store";
const { createContext, useState, useEffect } = require("react");
import { Platform } from "react-native";

export const AccountContext = createContext();

const UserContext = ({ children }) => {
  let myToken;
  if (Platform.OS === "web") {
    myToken = null;
  } else {
    getToken = SecureStore.getItemAsync("token");
    if (getToken._j != null) {
      myToken = getToken._j;
    } else {
      myToken = null;
    }
  }

  const [user, setUser] = useState({
    token: myToken,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   fetch(`https://coral-app-n96bn.ondigitalocean.app/auth/login`, {
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //       authorization: `${user.token}`,
  //     },
  //   })
  //     .catch((err) => {
  //       setUser({ token: null });
  //       return;
  //     })
  //     .then((r) => {
  //       if (!r || !r.ok || r.status >= 400) {
  //         setUser({ token: null });
  //         return;
  //       }
  //       return r.json();
  //     });
  // }, []);
  return (
    <AccountContext.Provider
      value={{ user, setUser, isLoggedIn, setIsLoggedIn }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;
