import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  FlatList,
  Platform,
} from "react-native";
import React, { useState, useEffect, useContext, memo } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAssets } from "expo-asset";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreenLeaderboard() {
  const { user } = useContext(AccountContext);
  const isFocused = useIsFocused();

  const [assets] = useAssets([
    require("../../assets/avatars/avatar1.png"),
    require("../../assets/avatars/avatar2.png"),
    require("../../assets/avatars/avatar3.png"),
    require("../../assets/avatars/avatar4.png"),
    require("../../assets/avatars/avatar5.png"),
    require("../../assets/avatars/avatar6.png"),
    require("../../assets/avatars/avatar7.png"),
    require("../../assets/avatars/avatar8.png"),
    require("../../assets/avatars/avatar9.png"),
  ]);

  const avatars = [
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
    const randomIndex = Math.floor(Math.random() * avatars.length);
    return avatars[randomIndex];
  };

  const [leaderboardStats, setLeaderboardStats] = useState([
    {
      className: "MA 227",
      leaders: [
        { name: "person1", placement: 1, profilePicture: getRandomAvatar() },
        { name: "person2", placement: 3, profilePicture: getRandomAvatar() },
        { name: "person3", placement: 2, profilePicture: getRandomAvatar() },
      ],
    },
    {
      className: "CS 332",
      leaders: [
        { name: "person1", placement: 1, profilePicture: getRandomAvatar() },
        { name: "person2", placement: 3, profilePicture: getRandomAvatar() },
        { name: "person3", placement: 2, profilePicture: getRandomAvatar() },
      ],
    },
    {
      className: "MA 252",
      leaders: [
        { name: "person1", placement: 1, profilePicture: getRandomAvatar() },
        { name: "person2", placement: 3, profilePicture: getRandomAvatar() },
        { name: "person3", placement: 2, profilePicture: getRandomAvatar() },
      ],
    },
  ]);

  const getMyLeaderboards = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8080/groups/myleaderboards`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();

      // Assign random avatars only if profilePicture is null or empty
      const updatedData = jsonData.map((group) => ({
        ...group,
        leaders: group.leaders.map((leader) => ({
          ...leader,
          profilePicture:
            leader.profilePicture && leader.profilePicture.trim()
              ? { uri: leader.profilePicture }
              : getRandomAvatar(),
        })),
      }));

      setLeaderboardStats(updatedData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getMyLeaderboards();
  }, [user]);

  const MemoizedItem = memo(({ item }) => {
    return (
      <View key={item.group_id}>
        <View
          style={{
            flexDirection: "row",
            height: "100%",
            width: screenWidth * 0.9,
            minHeight: 200,
            maxHeight: 300,
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
              maxHeight: 280,
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
                width: Platform.OS === "web" ? screenWidth * 0.9 : "90%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.leaders.map((leader, index) => (
                <View
                  key={index}
                  style={{
                    height: "100%",
                    alignItems: "center",
                    width: Platform.OS === "web" ? screenWidth * 0.2 : "30%",
                    justifyContent: "center",
                    marginBottom: screenWidth * 0.02,
                  }}
                >
                  <Image
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: 50,
                    }}
                    source={leader.profilePicture}
                  />
                  <Text
                    style={[
                      globalStyles.caption,
                      { marginTop: 5, width: "90%", textAlign: "center" },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
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
          <FontAwesome6
            name="chevron-right"
            color="#2482AA"
            size={24}
            style={{ paddingRight: 4 }}
          />
        </View>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 16,
            borderColor: "#050505",
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
