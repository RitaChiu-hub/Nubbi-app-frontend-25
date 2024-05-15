import * as React from "react";
import { View, Text, Image, Platform, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";
import { useAssets } from "expo-asset";

export default function GroupAchievementsScreen({ navigation }) {
  let assets1 = useAssets([require("../../assets/badges/ComposerBadge.png")]);
  let assets2 = useAssets([require("../../assets/badges/ComposerBadge2.png")]);
  let assets3 = useAssets([
    require("../../assets/badges/ConversationBadge.png"),
  ]);
  let assets4 = useAssets([require("../../assets/badges/ExplorerBadge.png")]);
  let assets5 = useAssets([require("../../assets/badges/IdeaBadge.png")]);
  let assets6 = useAssets([
    require("../../assets/badges/InvestigatorBadge.png"),
  ]);
  let assets7 = useAssets([
    require("../../assets/badges/leaderboardBadge.png"),
  ]);
  let assets8 = useAssets([require("../../assets/badges/LighteningBadge.png")]);
  let assets9 = useAssets([require("../../assets/badges/LightningBadge2.png")]);
  let assets10 = useAssets([require("../../assets/badges/PictureBadge.png")]);
  let assets11 = useAssets([require("../../assets/badges/Picture2Badge.png")]);
  let assets12 = useAssets([require("../../assets/badges/RainBadge.png")]);
  let assets13 = useAssets([require("../../assets/badges/RocketeerBadge.png")]);
  let assets14 = useAssets([require("../../assets/badges/Sagebadge.png")]);
  let assets15 = useAssets([require("../../assets/badges/SageBadge2.png")]);
  let assets16 = useAssets([require("../../assets/badges/ShieldBadge.png")]);
  let assets17 = useAssets([require("../../assets/badges/Streakbadge.png")]);
  let assets18 = useAssets([require("../../assets/badges/Streak2badge.png")]);
  let assets19 = useAssets([require("../../assets/badges/WinnerBadge.png")]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingRegular}>My Group Achievements</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView style={{ backgroundColor: "#fdfdfd" }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fdfdfd",
          padding: 14,
          paddingTop: 24,
        }}
      >
        <View style={globalStyles.widthContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <React.Fragment>
              <Image
                style={{
                  width: 45,
                  height: 45,
                  tintColor: "gray",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                source={
                  Platform.OS == "web"
                    ? require("../../assets/badges/ComposerBadge.png")
                    : assets1[0]
                }
              />
              <Image
                style={{
                  width: 45,
                  height: 45,
                  opacity: 0.3,
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                source={
                  Platform.OS == "web"
                    ? require("../../assets/badges/ComposerBadge.png")
                    : assets1[0]
                }
              />
            </React.Fragment>
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
                marginLeft: 10,
              }}
            >
              <Text style={[globalStyles.headingText, { marginTop: 0 }]}>
                Achievement 1
              </Text>
              <Text style={globalStyles.bodyRegular}>
                Description of achievement
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
