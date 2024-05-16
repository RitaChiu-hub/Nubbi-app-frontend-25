import * as React from "react";
import { View, Text, Image, Platform, FlatList } from "react-native";
import { globalStyles } from "../../styles/global";
import { useAssets } from "expo-asset";

const badgeData = [
  {
    id: "1",
    asset: require("../../assets/badges/ComposerBadge.png"),
    title: "Composer Achievement",
    description: "Awarded for composing music with great skill and creativity.",
  },
  {
    id: "2",
    asset: require("../../assets/badges/ComposerBadge2.png"),
    title: "Advanced Composer Achievement",
    description:
      "Awarded for advanced music composition and outstanding creativity.",
  },
  {
    id: "3",
    asset: require("../../assets/badges/ConversationBadge.png"),
    title: "Conversation Starter",
    description:
      "Recognized for starting engaging and meaningful conversations.",
  },
  {
    id: "4",
    asset: require("../../assets/badges/ExplorerBadge.png"),
    title: "Explorer Achievement",
    description:
      "Given to those who explore new territories and seek adventure.",
  },
  {
    id: "5",
    asset: require("../../assets/badges/IdeaBadge.png"),
    title: "Idea Generator",
    description: "Awarded for generating innovative and groundbreaking ideas.",
  },
  {
    id: "6",
    asset: require("../../assets/badges/InvestigatorBadge.png"),
    title: "Investigator",
    description:
      "Recognized for exceptional investigative skills and curiosity.",
  },
  {
    id: "7",
    asset: require("../../assets/badges/leaderboardBadge.png"),
    title: "Leaderboard Champion",
    description: "Awarded for achieving top positions on the leaderboard.",
  },
  {
    id: "8",
    asset: require("../../assets/badges/LighteningBadge.png"),
    title: "Lightning Speed",
    description: "Recognized for completing tasks with lightning-fast speed.",
  },
  {
    id: "9",
    asset: require("../../assets/badges/LightningBadge2.png"),
    title: "Advanced Lightning Speed",
    description:
      "Awarded for exceptional speed and agility in completing challenges.",
  },
  {
    id: "10",
    asset: require("../../assets/badges/PictureBadge.png"),
    title: "Picture Perfect",
    description: "Recognized for taking beautiful and perfect pictures.",
  },
  {
    id: "11",
    asset: require("../../assets/badges/Picture2Badge.png"),
    title: "Advanced Photographer",
    description: "Awarded for exceptional skills in advanced photography.",
  },
  {
    id: "12",
    asset: require("../../assets/badges/RainBadge.png"),
    title: "Rain Maker",
    description:
      "Recognized for bringing new opportunities and making things happen.",
  },
  {
    id: "13",
    asset: require("../../assets/badges/RocketeerBadge.png"),
    title: "Rocketeer",
    description:
      "Awarded for reaching new heights and achieving ambitious goals.",
  },
  {
    id: "14",
    asset: require("../../assets/badges/Sagebadge.png"),
    title: "Sage",
    description: "Recognized for wisdom and providing valuable advice.",
  },
  {
    id: "15",
    asset: require("../../assets/badges/SageBadge2.png"),
    title: "Advanced Sage",
    description: "Awarded for advanced wisdom and insightful contributions.",
  },
  {
    id: "16",
    asset: require("../../assets/badges/ShieldBadge.png"),
    title: "Protector",
    description: "Recognized for protecting and defending others with bravery.",
  },
  {
    id: "17",
    asset: require("../../assets/badges/Streakbadge.png"),
    title: "Streak Holder",
    description: "Awarded for maintaining a consistent streak of achievements.",
  },
  {
    id: "18",
    asset: require("../../assets/badges/Streak2badge.png"),
    title: "Advanced Streak Holder",
    description:
      "Recognized for maintaining an advanced streak of continuous achievements.",
  },
  {
    id: "19",
    asset: require("../../assets/badges/WinnerBadge.png"),
    title: "Winner",
    description: "Awarded for winning competitions and achieving victory.",
  },
];

export default function GroupAchievementsScreen({ navigation }) {
  const [assets, error] = useAssets(badgeData.map((item) => item.asset));

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingRegular}>My Group Achievements</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  if (!assets) {
    return <Text>Loading...</Text>;
  }

  const renderItem = ({ item, index }) => (
    <View style={globalStyles.widthContainer} key={item.id}>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 24,
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
            source={Platform.OS === "web" ? item.asset : assets[index]}
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
            source={Platform.OS === "web" ? item.asset : assets[index]}
          />
        </React.Fragment>
        <View
          style={{
            alignItems: "flex-start",
            flex: 1,
            marginLeft: 45 + 24,
            flexShrink: 1,
          }}
        >
          <Text style={[globalStyles.headingText, { marginTop: 0 }]}>
            {item.title}
          </Text>
          <Text style={globalStyles.bodyRegular}>{item.description}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={badgeData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        alignItems: "center",
        backgroundColor: "#fdfdfd",
        padding: 14,
        paddingTop: 24,
      }}
    />
  );
}
