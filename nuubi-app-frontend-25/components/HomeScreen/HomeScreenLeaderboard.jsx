import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
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

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.headerTitle}>
        <View style={{ width: "5%", height: "100%" }}></View>
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={globalStyles.h2HeadingMedium}>Leaderboards</Text>
          <Entypo name="chevron-small-right" color="#2482AA" size={36} />
        </View>
        <View style={{ width: "5%" }}></View>
      </View>
      <View style={{ height: "75%", alignItems: "center" }}>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          snapToInterval={screenWidth}
          decelerationRate="normal"
          showsHorizontalScrollIndicator={false}
        >
          {leaderboardStats.map((classInfo, indexMain) => {
            return (
              <View key={indexMain}>
                <View style={{ flexDirection: "row", height: "100%" }}>
                  <View
                    style={{
                      width: screenWidth * 0.04,
                      height: "100%",
                    }}
                  ></View>
                  <View
                    style={{
                      height: screenWidth > 500 ? "400%" : "100%",
                      width: screenWidth * 0.92,
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: "black",
                    }}
                  >
                    <View style={globalStyles.subjectNameView}>
                      <Text
                        style={{
                          color: "#111111",
                          fontSize: 18,
                          fontFamily: "Poppins_600SemiBold",
                          letterSpacing: 0,
                        }}
                      >
                        {classInfo.className}
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
                    <View
                      style={{
                        height: "20%",
                        width: "40%",
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      {leaderboardStats.map((l, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              height: 6,
                              width: 14,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                height: indexMain == index ? 9 : 6,
                                width: indexMain == index ? 9 : 6,
                                backgroundColor:
                                  indexMain == index ? "lightgreen" : "gray",
                                borderRadius: 4,
                                borderWidth: indexMain == index ? 0.5 : 0,
                              }}
                            ></View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                  <View
                    style={{
                      width: screenWidth * 0.04,
                      height: "100%",
                    }}
                  ></View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View style={{ height: "5%" }}></View>
    </View>
  );
}
