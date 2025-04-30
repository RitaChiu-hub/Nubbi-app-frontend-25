// import * as React from "react";
// import { View, Text, Image, Platform, FlatList } from "react-native";
// import { globalStyles } from "../../styles/global";
// import { useAssets } from "expo-asset";
// import { useIsFocused } from "@react-navigation/native";
// import { AccountContext } from "../AccountContext";
// import * as SecureStore from "expo-secure-store";

// const certificateData = [
//   {
//     id: "1",
//     asset: require("../../assets/certificates/leadership_color_final.png"),
//     unwonAsset: require("../../assets/certificates/leadership_greyscale_final.png"),
//     title: "Leadership Award",
//     skill: "Initiative & Peer Leadership",
//     criteria: "Create 3 posts that receive at least 1 comment",
//   },
//   {
//     id: "2",
//     asset: require("../../assets/certificates/teamwork_color_final.png"),
//     unwonAsset: require("../../assets/certificates/teamwork_greyscale_final.png"),
//     title: "Teamwork Award",
//     skill: "Teamwork & Peer Support",
//     criteria: "Comment on 10 different posts and earn at least 15 points",
//   },
//   {
//     id: "3",
//     asset: require("../../assets/certificates/communication_color_final.png"),
//     unwonAsset: require("../../assets/certificates/communication_greyscale_final.png"),
//     title: "Communication Award",
//     skill: "Written Communication",
//     criteria: "Send at least one message on 10 separate days",
//   },
//   {
//     id: "4",
//     asset: require("../../assets/certificates/reliability_color_final.png"),
//     unwonAsset: require("../../assets/certificates/reliability_greyscale_final.png"),
//     title: "Reliability Award",
//     skill: "Reliability & Engagement",
//     criteria: "Send a post comment or message each week in 4 consecutive weeks",
//   },
// ];

// export default function CertificatesScreen({ navigation }) {
//   const { user } = React.useContext(AccountContext);
//   const isFocused = useIsFocused();
//   const [earned, setEarned] = React.useState([]);
//   const assetsToLoad = certificateData.flatMap((c) => [c.asset, c.unwonAsset]);
//   const [assets] = useAssets(assetsToLoad);

//   React.useEffect(() => {
//     async function fetchEarned() {
//       const token =
//         Platform.OS === "web"
//           ? sessionStorage.getItem("token")
//           : await SecureStore.getItemAsync("token");
//       try {
//         const res = await fetch(
//           "https://coral-app-n96bn.ondigitalocean.app/groups/getwoncertificates",
//           {
//             method: "POST",
//             credentials: "include",
//             headers: {
//               "Content-Type": "application/json",
//               ...(token ? { Authorization: `Bearer ${token}` } : {}),
//             },
//             body: JSON.stringify({
//               userId: user.id,
//               groupId: user.currentGroup,
//             }),
//           }
//         );
//         const data = await res.json();
//         // assume data is array of certificate titles
//         setEarned(data);
//       } catch (err) {
//         console.error(err);
//       }
//     }
//     if (isFocused) fetchEarned();
//   }, [isFocused]);

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitle: () => (
//         <Text style={globalStyles.h3HeadingWhite}>Group Certificates</Text>
//       ),
//       headerTitleAlign: "center",
//     });
//   }, [navigation]);

//   if (!assets) {
//     return <Text>Loading certificates...</Text>;
//   }

//   const renderItem = ({ item, index }) => {
//     const has = earned.includes(item.title);
//     // each certificate had two assets loaded in order
//     const source = has ? assets[index * 2] : assets[index * 2 + 1];

//     return (
//       <View style={{ width: "100%", marginBottom: 24 }} key={item.id}>
//         <View style={{ flexDirection: "row" }}>
//           <Image
//             source={source}
//             style={{
//               width: 64,
//               height: 64,
//               marginRight: 16,
//             }}
//             resizeMode="contain"
//           />
//           <View style={{ flex: 1, justifyContent: "center" }}>
//             <Text style={globalStyles.headingText}>{item.title}</Text>
//             <Text style={globalStyles.bodyRegular}>
//               Skill Highlighted: {item.skill}
//             </Text>
//             <Text style={globalStyles.bodyRegular}>
//               Earned by: {item.criteria}
//             </Text>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <FlatList
//       data={certificateData}
//       renderItem={renderItem}
//       keyExtractor={(item) => item.id}
//       contentContainerStyle={{
//         padding: 16,
//         backgroundColor: "#fbfbfb",
//         alignItems: "center",
//       }}
//     />
//   );
// }

import * as React from "react";
import { View, Text, Image, Platform, FlatList } from "react-native";
import { globalStyles } from "../../styles/global";
import { useAssets } from "expo-asset";
import { useIsFocused } from "@react-navigation/native";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

const certificateData = [
  {
    id: "1",
    asset: require("../../assets/certificates/leadership_color_final.png"),
    unwonAsset: require("../../assets/certificates/leadership_greyscale_final.png"),
    title: "Leadership Award",
    skill: "Initiative & Peer Leadership",
    criteria:
      "Create 3 posts that each receive at least 1 comment from another user",
  },
  {
    id: "2",
    asset: require("../../assets/certificates/teamwork_color_final.png"),
    unwonAsset: require("../../assets/certificates/teamwork_greyscale_final.png"),
    title: "Teamwork Award",
    skill: "Teamwork & Peer Support",
    criteria: "Comment on 10 different posts and earn at least 15 points",
  },
  {
    id: "3",
    asset: require("../../assets/certificates/communication_color_final.png"),
    unwonAsset: require("../../assets/certificates/communication_greyscale_final.png"),
    title: "Communication Award",
    skill: "Written Communication",
    criteria: "Send at least one message on 10 separate days",
  },
  {
    id: "4",
    asset: require("../../assets/certificates/reliability_color_final.png"),
    unwonAsset: require("../../assets/certificates/reliability_greyscale_final.png"),
    title: "Reliability Award",
    skill: "Reliability & Engagement",
    criteria: "Send a post comment or message each week in 4 consecutive weeks",
  },
];

export default function CertificatesScreen({ navigation }) {
  const { user } = React.useContext(AccountContext);
  const isFocused = useIsFocused();
  const [earned, setEarned] = React.useState([]);
  const assetsToLoad = certificateData.flatMap((c) => [c.asset, c.unwonAsset]);
  const [assets] = useAssets(assetsToLoad);

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
            body: JSON.stringify({
              userId: user.id,
              groupId: user.currentGroup,
            }),
          }
        );
        const data = await res.json();
        // assuming data is ["Leadership Award", "Teamwork Award", ...]
        setEarned(data);
      } catch (err) {
        console.error(err);
      }
    }

    if (isFocused) fetchEarned();
  }, [isFocused]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Group Certificates</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  if (!assets) {
    return <Text>Loading certificates...</Text>;
  }

  const renderItem = ({ item, index }) => {
    const has = earned.includes(item.title);
    const source = has ? assets[index * 2] : assets[index * 2 + 1];

    return (
      <View
        style={{
          width: "90%",
          maxWidth: 600,
          marginBottom: 24,
        }}
        key={item.id}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={source}
            style={{
              width: 64,
              height: 64,
              marginRight: 16,
            }}
            resizeMode="contain"
          />
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
              }}
            >
              <Text style={globalStyles.headingText}>{item.title}</Text>
              <Text style={[globalStyles.bodyRegular, { marginLeft: 8 }]}>
                {has ? "(Unlocked)" : "(Locked)"}
              </Text>
            </View>
            <Text style={globalStyles.bodyRegular}>
              Skill Highlighted: {item.skill}
            </Text>
            <Text style={globalStyles.bodyRegular}>
              Earned by: {item.criteria}
            </Text>
            {/* TODO: once backend returns group info, do:
                {has && item.wonGroups && (
                  <Text style={globalStyles.bodyRegular}>
                    Won in: {item.wonGroups.join(", ")}
                  </Text>
                )}
            */}
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={certificateData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        padding: 16,
        backgroundColor: "#fbfbfb",
        alignItems: "center",
      }}
    />
  );
}
