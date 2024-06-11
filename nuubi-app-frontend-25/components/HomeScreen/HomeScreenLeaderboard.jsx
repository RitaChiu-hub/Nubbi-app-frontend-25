import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import "../../assets/nuubiicon.png";
import { globalStyles } from "../../styles/global";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreenLeaderboard() {
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

  const renderItem = ({ item }) => {
    return (
      <View key={item.className}>
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
                {item.className}
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
              <View
                style={{
                  width: "30%",
                  height: "85%",
                  justifyContent: "flex-end",
                  alignItems: "center",
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
                />
              </View>
              <View
                style={{
                  width: "30%",
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
                />
              </View>
              <View
                style={{
                  width: "30%",
                  height: "85%",
                  alignItems: "center",
                  justifyContent: "flex-end",
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
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
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
