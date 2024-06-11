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
import { AccountContext } from "../AccountContext";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreenTasks({}) {
  const { user, setUser } = React.useContext(AccountContext);
  const [myTasks, setMyTasks] = React.useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [randomInfo, setRandomInfo] = useState([
    { name: "Submit 2 Posts", points: 200, claimed: true },
    { name: "Write 3 Comments", points: 150, claimed: true },
    { name: "Send 1 Live Chat", points: 100, claimed: false },
  ]);

  let assets1 = useAssets([require("../../assets/HomeCalendar.png")]);
  // let assets2 = useAssets([require("../assets/Carousel2.png")]);

  const getMyTasks = async () => {
    try {
      const response = await fetch(
        // `https://coral-app-n96bn.ondigitalocean.app/groups/mygrouptasks`,
        `http://localhost:8080/groups/mytasks`,
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
    getMyTasks();
  }, [isFocused]);

  // const renderItem = ({ item }) => (
  //   <View>
  //     <View style={{ flexDirection: "row", height: "100%" }}>
  //       <View
  //         style={{
  //           height: screenWidth > 500 ? "300%" : "100%",
  //           width: screenWidth * 0.92,
  //           overflow: "hidden",
  //           maxHeight: 200,
  //         }}
  //       >
  //         <View
  //           style={{
  //             height: "50%",
  //             width: "80%",
  //             alignSelf: "center",
  //             flexDirection: "row",
  //             justifyContent: "space-between",
  //             paddingTop: "10%",
  //           }}
  //         >
  //           <View>
  //             <Text style={{ height: "40%", fontSize: 17, fontWeight: "600" }}>
  //               {item.task}
  //             </Text>
  //             <Text style={{ fontSize: 14, color: "gray" }}>
  //               Group: {item.group_name}
  //             </Text>
  //             <View
  //               style={{
  //                 flexDirection: "row",
  //                 alignItems: "center",
  //                 height: "30%",
  //                 justifyContent: "space-between",
  //               }}
  //             >
  //               <View
  //                 style={{
  //                   width: "56%",
  //                   height: "45%",
  //                   backgroundColor: item.is_completed ? "#24D265" : "gray",
  //                   borderRadius: 20,
  //                 }}
  //               ></View>
  //               <Text style={{ width: "40%" }}>
  //                 {item.is_completed ? "Completed" : "Not completed"}
  //               </Text>
  //             </View>
  //           </View>
  //         </View>
  //         <View style={{ height: "5%" }}></View>
  //         <View style={{ flexDirection: "row", height: "20%" }}>
  //           <View
  //             style={{
  //               justifyContent: "center",
  //               alignItems: "center",
  //             }}
  //           >
  //             <Text
  //               style={{
  //                 paddingHorizontal: "10%",
  //                 fontSize: 18,
  //                 fontWeight: "600",
  //                 textAlign: "right",
  //                 width: "100%",
  //               }}
  //             >
  //               +{item.point_value} pts
  //             </Text>
  //           </View>
  //           <View
  //             style={{
  //               height: "100%",
  //               width: "60%",
  //               justifyContent: "center",
  //               alignItems: "center",
  //             }}
  //           >
  //             {!item.is_completed && (
  //               <TouchableOpacity
  //                 style={{
  //                   paddingVertical: 12,
  //                   paddingHorizontal: 50,
  //                   borderRadius: 60,
  //                   elevation: 3,
  //                   backgroundColor: "#2482AA",
  //                   alignSelf: "center",
  //                 }}
  //                 onPress={() => {
  //                   setUser({
  //                     ...user,
  //                     currentGroup: item.group_id,
  //                     groupName: item.group_name,
  //                     invitePasscode: item.invite_passcode,
  //                   });
  //                   navigation.navigate("Group Chat");
  //                 }}
  //               >
  //                 <Text style={{ color: "white", fontWeight: "600" }}>
  //                   Complete
  //                 </Text>
  //               </TouchableOpacity>
  //             )}
  //           </View>
  //         </View>
  //       </View>
  //     </View>
  //   </View>
  // );

  const MemoizedItem = React.memo(({ item }) => {
    return (
      <View>
        <View style={{ flexDirection: "row", height: "100%" }}>
          <View
            style={{
              height: screenWidth > 500 ? "300%" : "100%",
              width: screenWidth * 0.92,
              overflow: "hidden",
              maxHeight: 200,
            }}
          >
            <View
              style={{
                height: "50%",
                width: "80%",
                alignSelf: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: "10%",
              }}
            >
              <View>
                <Text
                  style={{ height: "40%", fontSize: 17, fontWeight: "600" }}
                >
                  {item.task}
                </Text>
                <Text style={{ fontSize: 14, color: "gray" }}>
                  Group: {item.group_name}
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
                      width: "56%",
                      height: "45%",
                      backgroundColor: item.is_completed ? "#24D265" : "gray",
                      borderRadius: 20,
                    }}
                  ></View>
                  <Text style={{ width: "40%" }}>
                    {item.is_completed ? "Completed" : "Not completed"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ height: "5%" }}></View>
            <View style={{ flexDirection: "row", height: "20%" }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    paddingHorizontal: "10%",
                    fontSize: 18,
                    fontWeight: "600",
                    textAlign: "right",
                    width: "100%",
                  }}
                >
                  +{item.point_value} pts
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
                {!item.is_completed && (
                  <TouchableOpacity
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 50,
                      borderRadius: 60,
                      elevation: 3,
                      backgroundColor: "#2482AA",
                      alignSelf: "center",
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
                    <Text style={{ color: "white", fontWeight: "600" }}>
                      Complete
                    </Text>
                  </TouchableOpacity>
                )}
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
            data={myTasks}
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
