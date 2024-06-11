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
import { Entypo } from "@expo/vector-icons";
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

  let assets1 = useAssets([require("../../assets/defaultAvatar.png")]);

  const getMyLeaderboards = async () => {
    try {
      const response = await fetch(
        // `https://coral-app-n96bn.ondigitalocean.app/groups/mygrouptasks`,
        `http://localhost:8080/groups/myleaderboards`,
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
    return (
      <View key={item.group_id}>
        <View style={{ flexDirection: "row", height: "100%" }}>
          <View
            style={{
              width: screenWidth * 0.04,
              height: "100%",
            }}
          ></View>
          <View
            style={{
              height: screenWidth > 500 ? "300%" : "100%",
              width: screenWidth * 0.92,
              overflow: "hidden",
              //  height: screenWidth > 500 ? screenWidth * 0.25 : screenWidth * 0.5,
              maxHeight: 200,
            }}
          >
            <View style={globalStyles.subjectNameView}>
              <Text style={globalStyles.h3HeadingRegular}>
                {item.classname}
              </Text>
            </View>
            <View
              style={{
                height: "60%",
                width: "80%",
                flexDirection: "row",
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.leaders.map((leader, index) => (
                <View
                  key={index}
                  style={{
                    width: "32%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    marginTop: 20,
                  }}
                >
                  <Image
                    style={{
                      height: "70%",
                      aspectRatio: 1,
                      borderRadius: 50,
                      borderWidth: 1,
                      borderColor: "black",
                    }}
                    source={
                      leader.profilePicture == null
                        ? Platform.OS == "web"
                          ? require("../../assets/defaultAvatar.png")
                          : assets1[0]
                        : { uri: leader.profilePicture }
                    }
                    //   source={{ uri: leader.profilePicture }}
                  />
                  <Text style={{ marginTop: 5 }}>
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
          <Entypo name="chevron-small-right" color="#2482AA" size={36} />
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
            snapToInterval={screenWidth}
            decelerationRate="normal"
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
}
