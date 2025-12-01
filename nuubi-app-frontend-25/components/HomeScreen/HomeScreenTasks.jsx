import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Platform,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import "../../assets/nuubiicon.png";
import { globalStyles } from "../../styles/global";
import { useAssets } from "expo-asset";
import alert from "../alert";
import { AccountContext } from "../AccountContext";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import config from "../../config";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreenTasks({}) {
  const { user, setUser } = React.useContext(AccountContext);
  const [myTasks, setMyTasks] = React.useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const deviceWidth = Dimensions.get("window").width;

  let assets1 = useAssets([require("../../assets/task.png")]);

  const getMyTasks = async () => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/groups/mytasks`,
        // `https://coral-app-n96bn.ondigitalocean.app/groups/mytasks`,
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
      setMyTasks(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    // getMyTasks();
  }, [isFocused]);

  const MemoizedItem = React.memo(({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          height: screenWidth > 500 ? "100%" : "100%",
          width: screenWidth * 0.9,
        }}
      >
        <View
          style={{
            flex: 1,
            overflow: "hidden",
            //   maxHeight: screenWidth > 500 ? 250 : 200,
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              paddingVertical: screenWidth > 500 ? "2%" : "5%",
              paddingHorizontal: "5%",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "space-between",
                //  paddingVertical: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  width: "90%",
                  paddingLeft: "5%",
                }}
              >
                <View style={{ width: "70%" }}>
                  <Text
                    style={[
                      globalStyles.h3HeadingRegular,
                      {
                        textAlign: "left",
                      },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.task}
                  </Text>
                  <Text style={globalStyles.caption}>
                    Group: {item.group_name}
                  </Text>
                </View>
                <Image
                  style={{
                    width: 65,
                    height: 65,
                  }}
                  source={
                    Platform.OS == "web"
                      ? require("../../assets/task.png")
                      : assets1[0]
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {item.is_completed ? (
                    <TouchableOpacity
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 40,
                        borderRadius: 60,
                        elevation: 3,
                        backgroundColor: "green", // Change the button color to green
                        alignItems: "center",
                        width:
                          deviceWidth > 500
                            ? deviceWidth * 0.5
                            : deviceWidth * 0.7,
                        maxWidth: 500,
                      }}
                      activeOpacity={1} // Make sure the button doesn't react to clicks
                    >
                      <Text style={globalStyles.primaryButtonText}>
                        Completed!
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 40,
                        borderRadius: 60,
                        elevation: 3,
                        backgroundColor: "#2482AA",
                        alignItems: "center",
                        width:
                          deviceWidth > 500
                            ? deviceWidth * 0.5
                            : deviceWidth * 0.7,
                        maxWidth: 500,
                      }}
                      onPress={() => {
                        setUser({
                          ...user,
                          currentGroup: item.group_id,
                          groupName: item.group_name,
                          invitePasscode: item.invite_passcode,
                        });
                        navigation.navigate("Group Chat");
                      }}
                    >
                      <Text style={globalStyles.primaryButtonText}>
                        Complete for {item.point_value} points!
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
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
          <Text style={globalStyles.h2HeadingMedium}>My Tasks</Text>
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
            height: screenWidth > 500 ? screenWidth * 0.25 : screenWidth * 0.4,
            maxHeight: 200,
          }}
        >
          <FlatList
            data={myTasks}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            // snapToInterval={screenWidth}
            snapToInterval={screenWidth * 0.9}
            decelerationRate="normal"
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.container}>
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>Stay tuned!</Text>
                  <Text style={styles.captionText}>
                    Your tasks will appear in this section once assigned.
                  </Text>
                </View>
                <Image
                  style={styles.image}
                  source={
                    Platform.OS === "web"
                      ? require("../../assets/task.png")
                      : assets1[0]
                  }
                />
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1, // Ensure it takes up full available space
    paddingHorizontal: Platform.OS === "web" ? "20%" : 10,
    width: screenWidth * 0.9,
  },
  textContainer: {
    width: Platform.OS === "web" ? "90%" : "50%",
    alignItems: "flex-start", // Align items to the start (left)
    flexShrink: 1, // Allow the container to shrink if necessary
  },
  titleText: {
    color: "#050505",
    textAlign: "left",
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  captionText: {
    ...globalStyles.caption,
    textAlign: "left",
  },
  image: {
    width: 75,
    height: 75,
    marginLeft: 20, // Adjust for spacing between text and image
  },
});
