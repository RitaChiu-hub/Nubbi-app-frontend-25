import * as React from "react";
import { View, Text, Image, Platform, FlatList } from "react-native";
import { globalStyles } from "../../styles/global";
import { useAssets } from "expo-asset";
import { useIsFocused } from "@react-navigation/native";
import { AccountContext } from "../AccountContext";

const badgeData = [
  {
    asset: require("../../assets/badges/ComposerBadge.png"),
    title: "Composer",
    description:
      "Create your first Discussion Post in this Nuubi Group. Points: 10",
  },
  {
    asset: require("../../assets/badges/ComposerBadge2.png"),
    title: "Composer II",
    description: "Create five discussion posts in this Nuubi Group.",
  },
  {
    asset: require("../../assets/badges/ConversationBadge.png"),
    title: "Conversationalist",
    description: "Send five chats in this Nuubi Group.",
  },
  {
    asset: require("../../assets/badges/IdeaBadge.png"),
    title: "Illuminator",
    description: "Get the most likes on a Discussion post this Nuubi Group.",
  },
  {
    asset: require("../../assets/badges/InvestigatorBadge.png"),
    title: "Investigator",
    description:
      "Commented on five different Discussion Posts in this Nuubi Group.",
  },
  {
    asset: require("../../assets/badges/LighteningBadge.png"),
    title: "Lightning",
    description: "Be the first person to reply to a post in this Nuubi Group.",
  },
  {
    asset: require("../../assets/badges/LightningBadge2.png"),
    title: "Lightning II",
    description:
      "Be the first person to reply to a post in this Nuubi Group five times.",
  },
  {
    asset: require("../../assets/badges/Picture2Badge.png"),
    title: "Photographer",
    description:
      "Post a Discussion Post in this Nuubi Group that contains an uploaded image.",
  },
  {
    asset: require("../../assets/badges/RainBadge.png"),
    title: "Ice Breaker",
    description: "Write your first live chat message in this Nuubi Group.",
  },
  {
    asset: require("../../assets/badges/RocketeerBadge.png"),
    title: "Rocketeer",
    description:
      "Most improved leaderboard ranking in the duration of one week.",
  },
  {
    asset: require("../../assets/badges/SageBadge.png"),
    title: "Sage",
    description: "Receive a point from the admin of this Nuubi Group.",
  },
  {
    asset: require("../../assets/badges/SageBadge2.png"),
    title: "Sage II",
    description: "Receive five points from the admin of this Nuubi Group.",
  },
  {
    asset: require("../../assets/badges/ShieldBadge.png"),
    title: "Collector",
    description: "Earn five badges in this Nuubi Group.",
  },
  {
    asset: require("../../assets/badges/Streakbadge.png"),
    title: "Streak",
    description: "Log in to this Nuubi Group five days in a row.",
  },
  {
    asset: require("../../assets/badges/Streak2badge.png"),
    title: "Streak II",
    description: "Log in to this Nuubi Group fifteen days in a row.",
  },
  {
    asset: require("../../assets/badges/WinnerBadge.png"),
    title: "Winner",
    description: "Got the top weekly leaderboard position in this Nuubi Group.",
  },
  {
    asset: require("../../assets/badges/leaderboardBadge.png"),
    title: "Leaderboard Champion",
    description:
      "Got the top monthly leaderboard position in this Nuubi Group.",
  },
];

const badgeDataWithIds = badgeData.map((badge, index) => ({
  id: (index + 1).toString(),
  ...badge,
}));

export default function GroupAchievementsScreen({ navigation }) {
  const [assets, assetsError] = useAssets(badgeData.map((item) => item.asset));
  const isFocused = useIsFocused();
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [wonBadges, setWonBadges] = React.useState([]);

  const getWonBadges = async () => {
    try {
      const response = await fetch(
        "https://coral-app-n96bn.ondigitalocean.app/groups/getwonbadges",
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

      // Filter badges based on the current group ID
      const badgesInCurrentGroup = jsonData.filter(
        (userBadge) => userBadge.group_id === user.currentGroup
      );

      // Extract unique badge titles
      const uniqueBadgeTitles = badgesInCurrentGroup
        .map((userBadge) => userBadge.badge && userBadge.badge.title)
        .filter((title, index, self) => title && self.indexOf(title) === index);

      // const uniqueBadgeTitles = jsonData
      //   .map((userBadge) => userBadge.badge && userBadge.badge.title)
      //   .filter((title, index, self) => title && self.indexOf(title) === index);
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
        <Text style={globalStyles.h3HeadingRegular}>My Group Achievements</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  if (!assets) {
    return <Text>Loading...</Text>;
  }

  const renderItem = ({ item, index }) => {
    const isBadgeWon = wonBadges.includes(item.title);

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
                tintColor: isBadgeWon ? "transparent" : "gray",
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
                opacity: isBadgeWon ? 1.0 : 0.2,
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
  };

  return (
    <FlatList
      data={badgeDataWithIds}
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
