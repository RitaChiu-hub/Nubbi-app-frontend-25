import * as SecureStore from "expo-secure-store";
const { createContext, useState, useEffect } = require("react");
import { Platform } from "react-native";

export const AccountContext = createContext();

const UserContext = ({ children }) => {
  let myToken;
  if (Platform.OS === "web") {
    myToken = localStorage.getItem("token");
  } else {
    myToken = SecureStore.getItemAsync("token");
  }

  const [user, setUser] = useState({
    // loggedIn: null,
    token: myToken,
    // userId: null,
    // currentGroup: null,
  });
  useEffect(() => {
    fetch(`http://localhost:8080/auth/login`, {
      credentials: "include",
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    })
      .catch((err) => {
        setUser({ loggedIn: false, message1: "A" });
        return;
      })
      .then((r) => {
        if (!r || !r.ok || r.status >= 400) {
          setUser({ loggedIn: false, message2: "B" });
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
    <AccountContext.Provider value={{ user, setUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;
