import * as React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../../styles/global";

export default function NotificationsScreen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Notifications",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Notifications coming soon!</Text>
    </View>
  );
}
