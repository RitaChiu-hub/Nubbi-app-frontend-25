import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { globalStyles } from "../../styles/global";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const defaultImage = "../../assets/nuubiTransparent45.png";

export default function HomeScreenBadges() {
  const badges = [
    { name: "Badge1", image: defaultImage },
    { name: "Badge1", image: defaultImage },
    { name: "Badge1", image: defaultImage },
    { name: "Badge1", image: defaultImage },
    { name: "Badge1", image: defaultImage },
    { name: "Badge1", image: defaultImage },
    { name: "Badge1", image: defaultImage },
    { name: "Badge1", image: defaultImage },
  ];
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
          <Text  style={globalStyles.h2HeadingMedium}>Badges</Text>
          <Entypo name="chevron-small-right" color="#2482AA" size={36} />
        </View>
        <View style={{ width: "5%" }}></View>
      </View>
      <View style={{ height: "75%", alignItems: "center" }}>
        <View style={{ flexDirection: "row", height: "100%" }}>
          <View
            style={{
              width: screenWidth * 0.04,
              height: "100%",
            }}
          ></View>
          <View
            style={{
              height: "100%",
              width: screenWidth * 0.92,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "black",
            }}
          >
            <View style={{ height: "20%" }}></View>

            <View style={{ height: "55%", width: "100%" }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {badges.map((badge, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        height: "100%",
                        width: (screenWidth * 0.92) / 3,
                      }}
                    >
                      <View
                        style={{
                          height: "74%",
                          width: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          //   source={{ uri: badge.image ||  }}
                          source={require("../../assets/badgeIcon.png")}
                          resizeMode="contain"
                          alt="Badge Image"
                          style={{
                            height: "100%",
                            aspectRatio: 1,
                            borderWidth: 0.5,
                            borderColor: "black",
                            borderRadius: screenWidth / 8,
                            resizeMode: "cover",
                          }}
                        />
                      </View>
                      <View style={{ height: "4%" }}></View>
                      <View style={{ height: "22%" }}>
                        <Text
                          style={{
                            color: "#111111",
                            fontSize: 18,
                            fontFamily: "Poppins_600SemiBold",
                            letterSpacing: 0,
                            alignSelf: "center"
                          }}
                        >
                          {badge.name}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
            <View style={{ height: "25%" }}></View>
          </View>
          <View
            style={{
              width: screenWidth * 0.04,
              height: "100%",
            }}
          ></View>
        </View>
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
    fontWeight: "700",
    fontSize: 18,
  },
  profilePicturesContainer: {
    backgroundColor: "blue",
  },
});
