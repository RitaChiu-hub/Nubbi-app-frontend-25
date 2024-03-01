import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

export default function HomeScreenNavBar({ forYouScreen, setForYouScreen }) {
  return (
    <View style={styles.container}>
      <View style={styles.topSpacing}>
        {/** empty div, 0.07 of the whole screen */}
      </View>
      <View style={styles.twoOptions}>
        <View style={{ flex: 0.2 }}></View>
        <TouchableOpacity
          onPress={() => {
            setForYouScreen(true);
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.navBarText,
                { color: forYouScreen ? "blue" : "gray" },
              ]}
            >
              For you
            </Text>
            {forYouScreen && (
              <View
                style={{
                  height: 4,
                  width: "60%",
                  backgroundColor: "blue",
                  marginTop: 6,
                }}
              ></View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setForYouScreen(false);
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.navBarText,
                { color: !forYouScreen ? "blue" : "gray" },
              ]}
            >
              Your groups
            </Text>
            {!forYouScreen && (
              <View
                style={{
                  height: 4,
                  width: "40%",
                  backgroundColor: "blue",
                  marginTop: 6,
                }}
              ></View>
            )}
          </View>
        </TouchableOpacity>
        <View style={{ flex: 0.2 }}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSpacing: {
    flex: 0.39,
  },
  twoOptions: {
    flex: 0.61,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navBarText: {
    fontSize: 18,
    fontWeight: "600",
  },
  selectedScreen: {
    textDecorationLine: "underline",
    textDecorationColor: "blue",
    color: "blue",
  },
  notSelectedScreen: {
    color: "gray",
  },
});