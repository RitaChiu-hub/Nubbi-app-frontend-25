import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import "../../assets/nuubiicon.png";
import { globalStyles } from "../../styles/global";
import { useAssets } from "expo-asset";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreenTasks({}) {
  const [randomInfo, setRandomInfo] = useState([
    { name: "Submit 2 Posts", points: 200, claimed: true },
    { name: "Write 3 Comments", points: 150, claimed: true },
    { name: "Send 1 Live Chat", points: 100, claimed: false },
  ]);

  let assets1 = useAssets([require("../../assets/HomeCalendar.png")]);
  // let assets2 = useAssets([require("../assets/Carousel2.png")]);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.headingText}>
        <View style={{ width: "5%", height: "100%" }}></View>
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={globalStyles.h2HeadingMedium}>Tasks</Text>
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
          {randomInfo.map((r, indexMain) => {
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
                      height: screenWidth > 500 ? "200%" : "100%",
                      width: screenWidth * 0.92,
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: "black",
                    }}
                  >
                    <View
                      style={{
                        height: "15%",
                        width: "97%",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Entypo name="info-with-circle" size={18} color="black" />
                    </View>
                    <View
                      style={{
                        height: "40%",
                        width: "70%",
                        alignSelf: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          height: "100%",
                          width: "30%",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          //     source={require("../../assets/HomeCalendar.png")}
                          source={
                            Platform.OS == "web"
                              ? require("../../assets/HomeCalendar.png")
                              : assets1[0]
                          }
                          style={{
                            width: 70,
                            height: 70,
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            resizeMode: "contain",
                          }}
                        />
                        {/* <Entypo
                            name="calendar"
                            size={65}
                            color="black"
                            style={{}}
                          /> */}
                      </View>
                      <View
                        style={{
                          height: "80%",
                          width: "67%",
                          justifyContent: "space-between",
                          alignSelf: "center",
                        }}
                      >
                        <Text
                          style={{
                            height: "40%",
                            fontSize: 17,
                            fontWeight: "600",
                          }}
                        >
                          {r.name}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            height: "30%",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              width: "77%",
                              height: "45%",
                              backgroundColor: r.claimed ? "#24D265" : "gray",
                              borderRadius: 20,
                            }}
                          ></View>
                          <Text style={{ width: "20%" }}>
                            {r.claimed ? "1" : "0"}/1
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ height: "5%" }}></View>
                    <View
                      style={{
                        flexDirection: "row",
                        height: "20%",
                      }}
                    >
                      <View
                        style={{
                          height: "100%",
                          width: "40%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "600",
                            textAlign: "right",
                            width: "100%",
                          }}
                        >
                          +{r.points} pts
                        </Text>
                      </View>
                      <View
                        style={{
                          height: "100%",
                          width: "60%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            paddingVertical: 12,
                            paddingHorizontal: 50,
                            borderRadius: 60,
                            elevation: 3,
                            backgroundColor: "#2482AA",
                            alignSelf: "center",
                          }}
                        >
                          <Text style={globalStyles.primaryButtonText}>
                            Collect
                          </Text>
                        </TouchableOpacity>
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
                      {randomInfo.map((r, index) => {
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
