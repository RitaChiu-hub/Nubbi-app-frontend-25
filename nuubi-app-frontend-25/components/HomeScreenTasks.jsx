import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
  } from "react-native";
  import React, { useState } from "react";
  import { Entypo } from "@expo/vector-icons";
  import "../../assets/nuubiicon.png";
  
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  
  export default function HomeScreenTasks({}) {
    const [randomInfo, setRandomInfo] = useState([
      { name: "Daily check-in", points: 100, claimed: true },
      { name: "Daily check-in", points: 100, claimed: true },
      { name: "Daily check-in", points: 100, claimed: true },
    ]);
  
    return (
      <View style={styles.container}>
        <View style={styles.headerTitle}>
          <View style={{ width: "5%", height: "100%" }}></View>
          <View
            style={{
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textTitle}>Taskssssss</Text>
            <Entypo name="chevron-small-right" color="gray" size={24} />
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
                     //   height: "100%",
                        height: screenWidth > 500 ? 500 : "100%",
                        width: screenWidth * 0.92,
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor: "black",
                        backgroundColor: "red",
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
                          <Entypo
                            name="calendar"
                            size={65}
                            color="black"
                            style={{}}
                          />
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
                                backgroundColor: r.claimed ? "green" : "gray",
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
                              height: "80%",
                              width: "60%",
                              borderRadius: 15,
                              backgroundColor: "#6699cc",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: "600",
                                textAlign: "center",
                                textAlignVertical: "center",
                                height: "100%",
                                color: "white",
                              }}
                            >
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
  
  const styles = StyleSheet.create({
    container: {
      height: screenHeight * 0.33,
    },
    headerTitle: {
      height: "20%",
      flexDirection: "row",
      alignItems: "center",
    },
    textTitle: {
      fontSize: 24,
      fontWeight: "500",
    },
    taskContainer: {
      height: "80%",
      width: "100%",
      backgroundColor: "red",
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 30,
      marginTop: 10,
    },
    subjectNameView: {
      height: "20%",
      justifyContent: "flex-end",
      width: screenWidth * 0.4,
      alignItems: "center",
    },
    subjectText: {
      textAlign: "center",
      textAlignVertical: "bottom",
      height: "100%",
      width: "100%",
      color: "black",
    },
    profilePicturesContainer: {
      backgroundColor: "blue",
    },
  });