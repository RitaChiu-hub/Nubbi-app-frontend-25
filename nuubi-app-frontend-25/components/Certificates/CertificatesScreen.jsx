import * as React from "react";
import { View, Text, Image, Platform, FlatList } from "react-native";
import { globalStyles } from "../../styles/global";
import { useAssets } from "expo-asset";
import { useIsFocused } from "@react-navigation/native";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
import socket from "../../socket";

const certificateData = [
  {
    id: 1,
    asset: require("../../assets/certificates/leadership_color_final.png"),
    unwonAsset: require("../../assets/certificates/leadership_greyscale_final.png"),
    title: "Leadership Award",
    skill: "Initiative & Peer Leadership",
    criteria:
      "Create 3 posts that each receive at least 1 comment from another user.",
  },
  {
    id: 2,
    asset: require("../../assets/certificates/teamwork_color_final.png"),
    unwonAsset: require("../../assets/certificates/teamwork_greyscale_final.png"),
    title: "Teamwork Award",
    skill: "Teamwork & Peer Support",
    criteria: "Comment on 10 different posts and earn at least 15 points.",
  },
  {
    id: 3,
    asset: require("../../assets/certificates/communication_color_final.png"),
    unwonAsset: require("../../assets/certificates/communication_greyscale_final.png"),
    title: "Communication Award",
    skill: "Written Communication",
    criteria: "Send at least one message on 10 separate days.",
  },
  {
    id: 4,
    asset: require("../../assets/certificates/reliability_color_final.png"),
    unwonAsset: require("../../assets/certificates/reliability_greyscale_final.png"),
    title: "Reliability Award",
    skill: "Reliability & Engagement",
    criteria:
      "Send a post comment or message each week in 4 consecutive weeks.",
  },
];

export default function CertificatesScreen({ navigation }) {
  const { user } = React.useContext(AccountContext);
  const isFocused = useIsFocused();

  // earnedAwards: [{ award_id, title, group_id, group_name }]
  const [earnedAwards, setEarnedAwards] = React.useState([]);
  const assetsToLoad = certificateData.flatMap((c) => [c.asset, c.unwonAsset]);
  const [assets] = useAssets(assetsToLoad);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // For Mobile: Retrieve token from SecureStore
  async function getTokenFromSecureStore() {
    try {
      const token = await SecureStore.getItemAsync("token");
      return token || null;
    } catch (error) {
      return null;
    }
  }

  // For Web
  async function checkWebLogin() {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/auth/checkweblogin`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return data.isLoggedIn; // Assuming the backend returns { isLoggedIn: true/false }
    } catch (error) {
      console.error("Error checking login status:", error);
      return false; // Default to false if there's an error
    }
  }

  // Check if user is logged in (cross-platform)
  async function checkIsLoggedIn() {
    if (Platform.OS === "web") {
      // Web: Use the new checkWebLogin function
      return await checkWebLogin();
    } else {
      // Mobile: Check SecureStore
      const token = await getTokenFromSecureStore();
      return !!token; // Check if token exists
    }
  }

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await checkIsLoggedIn(); // Call the async login check
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus(); // Run the check when the component mounts
  }, [user.loggedIn]);

  // React.useEffect(() => {
  //   if (isLoggedIn === true && !socket.connected) {
  //     socket.connect();
  //   } else {
  //     socket.disconnect();
  //   }
  // }, [isLoggedIn]);

  React.useEffect(() => {
    async function fetchEarned() {
      const token =
        Platform.OS === "web"
          ? sessionStorage.getItem("token")
          : await SecureStore.getItemAsync("token");

      try {
        const res = await fetch(
          "https://coral-app-n96bn.ondigitalocean.app/groups/getwoncertificates",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({}), // <— no groupId needed
          }
        );

        if (!res.ok) {
          console.error(
            "getWonCertificates failed",
            res.status,
            await res.text()
          );
          setEarnedAwards([]);
          return;
        }

        const data = await res.json();
        setEarnedAwards(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching earned awards:", err);
        setEarnedAwards([]);
      }
    }

    if (isFocused) fetchEarned();
  }, [isFocused]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>My Awards</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  if (!assets) {
    return <Text>Loading awards...</Text>;
  }

  const renderItem = ({ item, index }) => {
    // find earned info for this award
    const earnedInfo = earnedAwards.find((a) => a.award_id === item.id);
    const has = Boolean(earnedInfo);
    const source = has ? assets[index * 2] : assets[index * 2 + 1];

    return (
      <View
        style={{
          width: "100%",
          maxWidth: 600,
          alignSelf: "center",
          marginBottom: 24,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Image
            source={source}
            style={{ width: 64, height: 64, marginTop: 10 }}
            resizeMode="contain"
          />

          <View style={{ flex: 1, flexShrink: 1, marginLeft: 16 }}>
            <Text style={globalStyles.headingText}>
              {item.title}{" "}
              <Text style={globalStyles.bodyRegular}>
                ({has ? "Won!" : "Unwon"})
              </Text>
            </Text>

            <Text style={[globalStyles.bodyRegular, { flexWrap: "wrap" }]}>
              Skill Highlighted: {item.skill}
            </Text>

            {has ? (
              <Text style={[globalStyles.bodyRegular, { flexWrap: "wrap" }]}>
                Won in:{" "}
                <Text style={{ fontFamily: "Poppins_600SemiBold" }}>
                  {earnedInfo.group_name}
                </Text>
              </Text>
            ) : (
              <Text style={[globalStyles.bodyRegular, { flexWrap: "wrap" }]}>
                Earned by: {item.criteria}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fbfbfb", alignItems: "center" }}>
      <View
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 16,
          minWidth: 300,
          maxWidth: 600,
          borderWidth: 1,
          borderRadius: 16,
          marginHorizontal: 16,
          marginVertical: 8,
          borderColor: "#ddd",
          backgroundColor: "#fbfbfb",
          elevation: 15,
          shadowColor: "#333333",
          shadowOpacity: 0.5,
          shadowRadius: 2,
          shadowOffset: { width: 0.8, height: 0.8 },
          overflow: "visible",
        }}
      >
        <Text style={[globalStyles.bodyRegular, { textAlign: "center" }]}>
          Earn recognition for skills that matter! Click{" "}
          <Text style={{ fontFamily: "Poppins_600SemiBold" }}>"My Groups"</Text>{" "}
          in the navigation bar to start earning awards that spotlight your
          strengths.
        </Text>
      </View>

      <FlatList
        data={certificateData}
        renderItem={renderItem}
        keyExtractor={(i) => i.id.toString()}
        style={{ width: "90%" }}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </View>
  );
}

// import * as React from "react";
// import { View, Text, Image, Platform, FlatList } from "react-native";
// import { globalStyles, nuubiColors } from "../../styles/global";
// import { useAssets } from "expo-asset";
// import { useIsFocused } from "@react-navigation/native";
// import { AccountContext } from "../AccountContext";
// import * as SecureStore from "expo-secure-store";
// import socket from "../../socket";

// const certificateData = [
//   {
//     id: "1",
//     asset: require("../../assets/certificates/leadership_color_final.png"),
//     unwonAsset: require("../../assets/certificates/leadership_greyscale_final.png"),
//     title: "Leadership Award",
//     skill: "Initiative & Peer Leadership",
//     criteria:
//       "Create 3 posts that each receive at least 1 comment from another user.",
//   },
//   {
//     id: "2",
//     asset: require("../../assets/certificates/teamwork_color_final.png"),
//     unwonAsset: require("../../assets/certificates/teamwork_greyscale_final.png"),
//     title: "Teamwork Award",
//     skill: "Teamwork & Peer Support",
//     criteria: "Comment on 10 different posts and earn at least 15 points.",
//   },
//   {
//     id: "3",
//     asset: require("../../assets/certificates/communication_color_final.png"),
//     unwonAsset: require("../../assets/certificates/communication_greyscale_final.png"),
//     title: "Communication Award",
//     skill: "Written Communication",
//     criteria: "Send at least one message on 10 separate days.",
//   },
//   {
//     id: "4",
//     asset: require("../../assets/certificates/reliability_color_final.png"),
//     unwonAsset: require("../../assets/certificates/reliability_greyscale_final.png"),
//     title: "Reliability Award",
//     skill: "Reliability & Engagement",
//     criteria:
//       "Send a post comment or message each week in 4 consecutive weeks.",
//   },
// ];

// export default function CertificatesScreen({ navigation }) {
//   const [isLoggedIn, setIsLoggedIn] = React.useState(false);
//   const { user } = React.useContext(AccountContext);
//   const isFocused = useIsFocused();
//   const [earned, setEarned] = React.useState([]);
//   const assetsToLoad = certificateData.flatMap((c) => [c.asset, c.unwonAsset]);
//   const [assets] = useAssets(assetsToLoad);

//   // For Mobile: Retrieve token from SecureStore
//   async function getTokenFromSecureStore() {
//     try {
//       const token = await SecureStore.getItemAsync("token");
//       return token || null;
//     } catch (error) {
//       return null;
//     }
//   }

//   // For Web
//   async function checkWebLogin() {
//     try {
//       const response = await fetch(
//         `https://coral-app-n96bn.ondigitalocean.app/auth/checkweblogin`,
//         {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ ...user }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();

//       return data.isLoggedIn; // Assuming the backend returns { isLoggedIn: true/false }
//     } catch (error) {
//       console.error("Error checking login status:", error);
//       return false; // Default to false if there's an error
//     }
//   }

//   // Check if user is logged in (cross-platform)
//   async function checkIsLoggedIn() {
//     if (Platform.OS === "web") {
//       // Web: Use the new checkWebLogin function
//       return await checkWebLogin();
//     } else {
//       // Mobile: Check SecureStore
//       const token = await getTokenFromSecureStore();
//       return !!token; // Check if token exists
//     }
//   }

//   React.useEffect(() => {
//     const checkLoginStatus = async () => {
//       const loggedIn = await checkIsLoggedIn(); // Call the async login check
//       setIsLoggedIn(loggedIn);
//     };

//     checkLoginStatus(); // Run the check when the component mounts
//   }, [user.loggedIn]);

//   React.useEffect(() => {
//     if (isLoggedIn === true) {
//       socket.connect();
//     } else {
//       socket.disconnect();
//     }
//   }, [isLoggedIn]);

//   //   React.useEffect(() => {
//   //     async function fetchEarned() {
//   //       const token =
//   //         Platform.OS === "web"
//   //           ? sessionStorage.getItem("token")
//   //           : await SecureStore.getItemAsync("token");
//   //       try {
//   //         const res = await fetch(
//   //           "https://coral-app-n96bn.ondigitalocean.app/groups/getwoncertificates",
//   //           {
//   //             method: "POST",
//   //             credentials: "include",
//   //             headers: {
//   //               "Content-Type": "application/json",
//   //               ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   //             },
//   //             body: JSON.stringify({
//   //               userId: user.id,
//   //               groupId: user.currentGroup,
//   //             }),
//   //           }
//   //         );
//   //         const data = await res.json();
//   //         setEarned(data);
//   //       } catch (err) {
//   //         console.error(err);
//   //       }
//   //     }
//   //     if (isFocused) fetchEarned();
//   //   }, [isFocused]);

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitle: () => (
//         <Text style={globalStyles.h3HeadingWhite}>My Awards</Text>
//       ),
//       headerTitleAlign: "center",
//     });
//   }, [navigation]);

//   if (!assets) {
//     return <Text>Loading awards...</Text>;
//   }

//   const renderItem = ({ item, index }) => {
//     const has = earned.includes(item.title);
//     const source = has ? assets[index * 2] : assets[index * 2 + 1];

//     return (
//       <View
//         style={{
//           // 100% of whatever width your FlatList is
//           width: "100%",
//           maxWidth: 600,
//           alignSelf: "center",
//           marginBottom: 24,
//         }}
//       >
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "flex-start",
//             width: "100%",
//           }}
//         >
//           <Image
//             source={source}
//             style={{ width: 64, height: 64, marginTop: 10 }}
//             resizeMode="contain"
//           />

//           <View
//             style={{
//               // take remaining space, but allow wrapping
//               flex: 1,
//               flexShrink: 1,
//               marginLeft: 16,
//             }}
//           >
//             <Text style={globalStyles.headingText}>
//               {item.title}{" "}
//               <Text style={globalStyles.bodyRegular}>
//                 ({has ? "Unlocked" : "Locked"})
//               </Text>
//             </Text>

//             <Text style={[globalStyles.bodyRegular, { flexWrap: "wrap" }]}>
//               Skill Highlighted: {item.skill}
//             </Text>

//             <Text style={[globalStyles.bodyRegular, { flexWrap: "wrap" }]}>
//               Earned by: {item.criteria}
//             </Text>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: "#fbfbfb", alignItems: "center" }}>
//       <View
//         style={{
//           alignItems: "flex-start",
//           justifyContent: "center",
//           padding: 16,
//           minWidth: 300,
//           maxWidth: 600,
//           borderWidth: 1,
//           borderRadius: 16,
//           marginHorizontal: 16,
//           marginVertical: 8,
//           borderColor: "#ddd",
//           backgroundColor: "#fbfbfb",
//           elevation: 15,
//           shadowColor: "#333333",
//           shadowOpacity: 0.5,
//           shadowRadius: 2,
//           shadowOffset: {
//             width: 0.8,
//             height: 0.8,
//           },
//           overflow: "visible",
//         }}
//       >
//         <Text style={[globalStyles.bodyRegular, { textAlign: "center" }]}>
//           Earn recognition for skills that matter! Click{" "}
//           <Text style={{ fontFamily: "Poppins_600SemiBold" }}>"My Groups”</Text>{" "}
//           in the navigation bar to start earning awards that spotlight your
//           strengths.
//         </Text>
//       </View>
//       <FlatList
//         data={certificateData}
//         renderItem={renderItem}
//         keyExtractor={(i) => i.id}
//         style={{ width: "90%" }} // or use listWidth from useWindowDimensions
//         contentContainerStyle={{ paddingVertical: 16 }}
//       />
//     </View>
//   );
// }
