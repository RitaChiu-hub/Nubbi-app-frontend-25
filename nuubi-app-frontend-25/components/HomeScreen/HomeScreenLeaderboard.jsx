import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  FlatList,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import "../../assets/nuubiicon.png";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import { AccountContext } from "../AccountContext";
import { useAssets } from "expo-asset";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreenLeaderboard() {
  const { user, setUser } = React.useContext(AccountContext);
  const isFocused = useIsFocused();
  const [leaderboardStats, setLeaderboardStats] = useState([
    {
      className: "MA 227",
      leaders: [
        { name: "person1", placement: 1, profilePicture: "example" },
        { name: "person2", placement: 3, profilePicture: "example" },
        { name: "person3", placement: 2, profilePicture: "example" },
      ],
    },
    {
      className: "CS 332",
      leaders: [
        { name: "person1", placement: 1, profilePicture: "example" },
        { name: "person2", placement: 3, profilePicture: "example" },
        { name: "person3", placement: 2, profilePicture: "example" },
      ],
    },
    {
      className: "MA 252",
      leaders: [
        { name: "person1", placement: 1, profilePicture: "example" },
        { name: "person2", placement: 3, profilePicture: "example" },
        { name: "person3", placement: 2, profilePicture: "example" },
      ],
    },
  ]);

  // Load all avatar assets
  let [assets1] = useAssets([require("../../assets/avatars/avatar1.png")]);
  let [assets2] = useAssets([require("../../assets/avatars/avatar2.png")]);
  let [assets3] = useAssets([require("../../assets/avatars/avatar3.png")]);
  let [assets4] = useAssets([require("../../assets/avatars/avatar4.png")]);
  let [assets5] = useAssets([require("../../assets/avatars/avatar5.png")]);
  let [assets6] = useAssets([require("../../assets/avatars/avatar6.png")]);
  let [assets7] = useAssets([require("../../assets/avatars/avatar7.png")]);
  let [assets8] = useAssets([require("../../assets/avatars/avatar8.png")]);
  let [assets9] = useAssets([require("../../assets/avatars/avatar9.png")]);

  const assets = [
    require("../../assets/avatars/avatar1.png"),
    require("../../assets/avatars/avatar2.png"),
    require("../../assets/avatars/avatar3.png"),
    require("../../assets/avatars/avatar4.png"),
    require("../../assets/avatars/avatar5.png"),
    require("../../assets/avatars/avatar6.png"),
    require("../../assets/avatars/avatar7.png"),
    require("../../assets/avatars/avatar8.png"),
    require("../../assets/avatars/avatar9.png"),
  ];

  const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * assets.length);
    return assets[randomIndex];
  };

  const getMyLeaderboards = async () => {
    try {
      const response = await fetch(
        // `https://coral-app-n96bn.ondigitalocean.app/groups/mygrouptasks`,
        `https://coral-app-n96bn.ondigitalocean.app/groups/myleaderboards`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setLeaderboardStats(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getMyLeaderboards();
  }, [user]);

  const MemoizedItem = React.memo(({ item }) => {
    const randomAvatar = getRandomAvatar();

    return (
      <View key={item.group_id}>
        <View
          style={{
            flexDirection: "row",
            height: "100%",
            width: screenWidth * 0.9,
          }}
        >
          <View
            style={{
              width: screenWidth * 0.04,
              height: "100%",
            }}
          ></View>
          <View
            style={{
              height: screenWidth > 500 ? "300%" : "100%",
              width: screenWidth * 0.9,
              overflow: "hidden",
              maxHeight: 200,
            }}
          >
            <View
              style={{
                height: "20%",
                justifyContent: "flex-end",
                alignItems: "flex-start",
                paddingLeft: 5,
              }}
            >
              <Text style={globalStyles.h3HeadingRegular}>
                {item.classname}
              </Text>
            </View>
            <View
              style={{
                height: "60%",
                flexDirection: "row",
              }}
            >
              {item.leaders.map((leader, index) => (
                <View
                  key={index}
                  style={{
                    height: "100%",
                    alignItems: "center",
                    marginTop: 20,
                    marginHorizontal: 5,
                  }}
                >
                  <Image
                    style={{
                      width: 75, // Adjust width for larger screens
                      height: 75, // Ensure height matches width
                      borderRadius: 50, // Make sure the borderRadius is half of the width/height to make it circular
                    }}
                    source={
                      leader.profilePicture == null
                        ? getRandomAvatar()
                        : { uri: leader.profilePicture }
                    }
                  />
                  <Text style={[globalStyles.caption, { marginTop: 5 }]}>
                    {leader.placement}: {leader.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  });

  // const MemoizedItem = React.memo(({ item }) => {
  //   const randomAvatar = getRandomAvatar();

  //   return (
  //     <View key={item.group_id}>
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           height: "100%",
  //           width: screenWidth * 0.9,
  //         }}
  //       >
  //         <View
  //           style={{
  //             width: screenWidth * 0.04,
  //             height: "100%",
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             height: screenWidth > 500 ? "300%" : "100%",
  //             width: screenWidth * 0.9,
  //             overflow: "hidden",
  //             maxHeight: 200,
  //           }}
  //         >
  //           <View
  //             style={{
  //               height: "20%",
  //               justifyContent: "flex-end",
  //               alignItems: "flex-start",
  //               paddingLeft: 5,
  //             }}
  //           >
  //             <Text style={globalStyles.h3HeadingRegular}>
  //               {item.classname}
  //             </Text>
  //           </View>
  //           <View
  //             style={{
  //               height: "60%",
  //               flexDirection: "row",
  //             }}
  //           >
  //             {item.leaders.map((leader, index) => (
  //               <View
  //                 key={index}
  //                 style={{
  //                   height: "100%",
  //                   alignItems: "center",
  //                   marginTop: 20,
  //                   marginHorizontal: 5,
  //                 }}
  //               >
  //                 <Image
  //                   style={{
  //                     height: "70%",
  //                     aspectRatio: 1,
  //                     borderRadius: 50,
  //                   }}
  //                   // source={
  //                   //   leader.profilePicture == null
  //                   //     ? Platform.OS == "web"
  //                   //       ? require("../../assets/avatars/avatar1.png")
  //                   //       : assets1[0]
  //                   //     : { uri: leader.profilePicture }
  //                   // }
  //                   source={
  //                     leader.profilePicture == null
  //                       ? Platform.OS == "web"
  //                         ? getRandomAvatar()
  //                         : getRandomAvatar()
  //                       : { uri: leader.profilePicture }
  //                   }
  //                 />
  //                 <Text style={[globalStyles.caption, { marginTop: 5 }]}>
  //                   {leader.placement}: {leader.name}
  //                 </Text>
  //               </View>
  //             ))}
  //           </View>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // });

  const renderItem = ({ item }) => {
    return <MemoizedItem item={item} />;
  };

  return (
    <View style={globalStyles.container}>
      <View
        style={{
          width: screenWidth * 0.9,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={globalStyles.h2HeadingMedium}>My Leaderboards</Text>
          <FontAwesome6 name="chevron-right" color="#2482AA" size={24} style={{paddingRight: 4}} />
        </View>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 16,
            borderColor: "#111111",
            overflow: "hidden",
            height: screenWidth > 500 ? screenWidth * 0.25 : screenWidth * 0.5,
            maxHeight: 200,
          }}
        >
          <FlatList
            data={leaderboardStats}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            snapToInterval={screenWidth * 0.9}
            decelerationRate="normal"
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
}
