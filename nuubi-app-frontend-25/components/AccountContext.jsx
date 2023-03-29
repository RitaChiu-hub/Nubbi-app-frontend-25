// import * as SecureStore from "expo-secure-store";
// const { createContext, useState, useEffect } = require("react");

// export const AccountContext = createContext();

// const UserContext = ({ children }) => {
//   const [user, setUser] = useState({
//     loggedIn: null,
//     token: SecureStore.getItemAsync("token"),
//     userId: null,
//     currentGroup: null,
//   });
//   useEffect(() => {
//     fetch(`https://coral-app-n96bn.ondigitalocean.app/auth/login`, {
//       credentials: "include",
//       headers: {
//         authorization: `Bearer ${user.token}`,
//       },
//     })
//       .catch((err) => {
//         setUser({ loggedIn: false });
//         return;
//       })
//       .then((r) => {
//         if (!r || !r.ok || r.status >= 400) {
//           setUser({ loggedIn: false });
//           return;
//         }
//         return r.json();
//       })
//       .then((data) => {
//         if (!data) {
//           setUser({ loggedIn: false });
//           return;
//         }
//         setUser({ ...data });
//       });
//   }, []);
//   return (
//     <AccountContext.Provider value={{ user, setUser }}>
//       {children}
//     </AccountContext.Provider>
//   );
// };

// export default UserContext;
