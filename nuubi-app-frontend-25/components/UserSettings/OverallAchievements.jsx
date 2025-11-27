import * as React from "react";
import { View, Text, Image, Platform, FlatList } from "react-native";
import { globalStyles } from "../../styles/global";
import { useAssets } from "expo-asset";
import { useIsFocused } from "@react-navigation/native";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

const badgeData = [
  {
    asset: require("../../assets/badges/ComposerBadge.png"),
    unwonAsset: require("../../assets/unwonbadges/ComposerBadge.png"),
    title: "Composer",
    description: "Create your first Discussion Post in a group.",
  },
  // {
  //   asset: require("../../assets/badges/ComposerBadge2.png"),
  //   unwonAsset: require("../../assets/unwonbadges/ComposerBadge2.png"),
  //   title: "Composer II",
  //   description: "Create five discussion posts in a Nuubi Group.",
  // },
  // {
  //   asset: require("../../assets/badges/ConversationBadge.png"),
  //   unwonAsset: require("../../assets/unwonbadges/ConversationBadge.png"),
  //   title: "Conversationalist",
  //   description: "Send five chats in a Nuubi Group.",
  // },
  // {
  //   asset: require("../../assets/badges/ExplorerBadge.png"),
  //   unwonAsset: require("../../assets/unwonbadges/ExplorerBadge.png"),
  //   title: "Voyager",
  //   description:
  //     "Join three Nuubi groups (Hint: you can use the Discover page to find Public Groups to join).",
  // },
  // {
  //   asset: require("../../assets/badges/IdeaBadge.png"),
  //   unwonAsset: require("../../assets/unwonbadges/IdeaBadge.png"),
  //   title: "Illuminator",
  //   description: "Get the most likes on a Discussion post this Nuubi Group.",
  // },
  // {
  //   asset: require("../../assets/badges/InvestigatorBadge.png"),
  //   unwonAsset: require("../../assets/unwonbadges/InvestigatorBadge.png"),
  //   title: "Investigator",
  //   description:
  //     "Commented on five different Discussion Posts in a Nuubi Group.",
  // },
  // {
  //   asset: require("../../assets/badges/LighteningBadge.png"),
  //   unwonAsset: require("../../assets/unwonbadges/LighteningBadge.png"),
  //   title: "Lightning",
  //   description: "Be the first person to reply to a post in a Nuubi Group.",
  // },
  // {
  //   asset: require("../../assets/badges/LightningBadge2.png"),
  //   unwonAsset: require("../../assets/unwonbadges/LighteningBadge2.png"),
  //   title: "Lightning II",
  //   description:
  //     "Be the first person to reply to a post in a Nuubi Group five times.",
  // },
  // {
  //   asset: require("../../assets/badges/PictureBadge.png"),
  //   unwonAsset: require("../../assets/unwonbadges/PictureBadge.png"),
  //   title: "Photogenic",
  //   description:
  //     "Personalize your Nuubi profile by choosing a new picture for your avatar.",
  // },
  // {
  //   asset: require("../../assets/badges/Picture2Badge.png"),
  //   unwonAsset: require("../../assets/unwonbadges/Picture2Badge.png"),
  //   title: "Photographer",
  //   description:
  //     "Post a Discussion Post in a Nuubi Group that contains an uploaded image.",
  // },
  {
    asset: require("../../assets/badges/RainBadge.png"),
    unwonAsset: require("../../assets/unwonbadges/RainBadge.png"),
    title: "Ice Breaker",
    description: "Write your first live chat message in a group. Coming Soon!",
  },
  // {
  //   asset: require("../../assets/badges/RocketeerBadge.png"),
  //   unwonAsset: require("../../assets/unwonbadges/RocketeerBadge.png"),
  //   title: "Rocketeer",
  //   description:
  //     "Most improved leaderboard ranking in the duration of one week.",
  // },
  // {
  //   asset: require("../../assets/badges/SageBadge.png"),
  //   unwonAsset: require("../../assets/unwonbadges/SageBadge.png"),
  //   title: "Sage",
  //   description: "Receive a point from the admin of this Nuubi Group.",
  // },
  // {
  //   asset: require("../../assets/badges/SageBadge2.png"),
  //   unwonAsset: require("../../assets/unwonbadges/SageBadge2.png"),
  //   title: "Sage II",
  //   description: "Receive five points from the admin of this Nuubi Group.",
  // },
  // {
  //   asset: require("../../assets/badges/ShieldBadge.png"),
  //   unwonAsset: require("../../assets/unwonbadges/ShieldBadge.png"),
  //   title: "Collector",
  //   description: "Earn five badges in a Nuubi Group.",
  // },
  {
    asset: require("../../assets/badges/Streakbadge.png"),
    unwonAsset: require("../../assets/unwonbadges/Streakbadge.png"),
    title: "Streak",
    description: "Log in to a group five days in a row. Coming Soon!",
  },
  // {
  //   asset: require("../../assets/badges/Streak2badge.png"),
  //   unwonAsset: require("../../assets/unwonbadges/Streak2badge.png"),
  //   title: "Streak II",
  //   description: "Log in to a Nuubi Group fifteen days in a row.",
  // },
  // {
  //   asset: require("../../assets/badges/WinnerBadge.png"),
  //   unwonAsset: require("../../assets/unwonbadges/WinnerBadge.png"),
  //   title: "Winner",
  //   description: "Got the top weekly leaderboard position in a Nuubi Group.",
  // },
  // {
  //   asset: require("../../assets/badges/leaderboardBadge.png"),
  //   unwonAsset: require("../../assets/unwonbadges/leaderboardBadge.png"),
  //   title: "Champion",
  //   description: "Got the top monthly leaderboard position in a Nuubi Group.",
  // },
];

const badgeDataWithIds = badgeData.map((badge, index) => ({
  id: (index + 1).toString(),
  ...badge,
}));

export default function OverallAchievementsScreen({ navigation }) {
  // const [assets, assetsError] = useAssets(badgeData.map((item) => item.asset));
  const assetsToLoad = badgeData.flatMap((item) => [
    item.asset,
    item.unwonAsset,
  ]);
  const [assets, assetsError] = useAssets(assetsToLoad);
  const isFocused = useIsFocused();
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [wonBadges, setWonBadges] = React.useState([]);

  const getWonBadges = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:8080/groups/getwonbadges",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();

      const uniqueBadgeTitles = jsonData
        .map((userBadge) => userBadge.badge && userBadge.badge.title)
        .filter((title, index, self) => title && self.indexOf(title) === index);
      setWonBadges(uniqueBadgeTitles);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getWonBadges();
  }, [isFocused]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>My Achievements</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  if (!assets) {
    return <Text>Loading...</Text>;
  }

  const renderItem = ({ item, index }) => {
    const isBadgeWon = wonBadges.includes(item.title);
    const badgeAsset = isBadgeWon
      ? item.asset
      : item.unwonAsset || item.unwonAsset;

    return (
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
                position: "absolute",
                top: 0,
                left: 0,
              }}
              source={
                Platform.OS === "web"
                  ? badgeAsset
                  : assets[index * 2 + (isBadgeWon ? 0 : 1)]
              }
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
  };

  return (
    <FlatList
      data={badgeDataWithIds}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        alignItems: "center",
        backgroundColor: "#fbfbfb",
        padding: 14,
        paddingTop: 24,
      }}
    />
  );
}
