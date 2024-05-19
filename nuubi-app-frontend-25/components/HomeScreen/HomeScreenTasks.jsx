import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Platform,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import "../../assets/nuubiicon.png";
import { globalStyles } from "../../styles/global";
import { useAssets } from "expo-asset";
import alert from "../alert";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreenTasks({}) {
  const [randomInfo, setRandomInfo] = useState([
    { name: "Submit 2 Posts", points: 200, claimed: true },
    { name: "Write 3 Comments", points: 150, claimed: true },
    { name: "Send 1 Live Chat", points: 100, claimed: false },
  ]);

  let assets1 = useAssets([require("../../assets/HomeCalendar.png")]);
  // let assets2 = useAssets([require("../assets/Carousel2.png")]);

  const renderItem = ({ item, index }) => (
    <View>
      <View style={{ flexDirection: "row", height: "100%" }}>
        <View
          style={{
            height: screenWidth > 500 ? "300%" : "100%",
            width: screenWidth * 0.92,
            overflow: "hidden",
            //  height: screenWidth > 500 ? screenWidth * 0.25 : screenWidth * 0.5,
            maxHeight: 200,
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
              style={{ height: "100%", width: "30%", justifyContent: "center" }}
            >
              <Image
                source={
                  Platform.OS === "web"
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
            </View>
            <View
              style={{
                height: "80%",
                width: "67%",
                justifyContent: "space-between",
                alignSelf: "center",
              }}
            >
              <Text style={{ height: "40%", fontSize: 17, fontWeight: "600" }}>
                {item.name}
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
                    backgroundColor: item.claimed ? "#24D265" : "gray",
                    borderRadius: 20,
                  }}
                ></View>
                <Text style={{ width: "20%" }}>
                  {item.claimed ? "1" : "0"}/1
                </Text>
              </View>
            </View>
          </View>
          <View style={{ height: "5%" }}></View>
          <View style={{ flexDirection: "row", height: "20%" }}>
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
                +{item.points} pts
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
                onPress={() => alert("Tasks are Coming Soon!")}
              >
                <Text style={globalStyles.primaryButtonText}>Collect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <View
        style={{
          width: screenWidth * 0.9,
          paddingVertical: 24,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={globalStyles.h2HeadingMedium}>My Tasks</Text>
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
            data={randomInfo}
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
