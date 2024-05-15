import * as React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../../styles/global";

export default function GroupAchievementsScreen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingRegular}>My Group Achievements</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fdfdfd",
      }}
    >
      <Text style={globalStyles.bodyRegular}>
        My Group Achievements coming soon!
      </Text>
    </View>
  );
}
